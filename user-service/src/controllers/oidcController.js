const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const oauthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Temporary one-time login codes.
// Each code is valid for 60 seconds and can only be used once.
const loginCodes = new Map();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3100';

function parseCookies(cookieHeader) {
  const cookies = {};

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach((cookie) => {
    const separatorIndex = cookie.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    const key = cookie.slice(0, separatorIndex).trim();
    const value = cookie.slice(separatorIndex + 1).trim();

    cookies[key] = decodeURIComponent(value);
  });

  return cookies;
}

function createState() {
  return crypto.randomBytes(32).toString('hex');
}

function createLoginCode() {
  return crypto.randomBytes(32).toString('hex');
}

exports.startLogin = (req, res) => {
  try {
    const state = createState();

    res.setHeader(
      'Set-Cookie',
      `oidc_state=${encodeURIComponent(state)}; HttpOnly; SameSite=Lax; Max-Age=600; Path=/`
    );

    const authorizationUrl = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
      state,
      prompt: 'select_account'
    });

    res.redirect(authorizationUrl);
  } catch (error) {
    console.error('OIDC start error:', error);
    res.status(500).json({
      message: 'Unable to start Google authentication'
    });
  }
};

exports.callback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({
        message: 'Missing OAuth authorization response'
      });
    }

    const cookies = parseCookies(req.headers.cookie);
    const storedState = cookies.oidc_state;

    if (
      !storedState ||
      storedState.length !== state.length ||
      !crypto.timingSafeEqual(
        Buffer.from(storedState),
        Buffer.from(state)
      )
    ) {
      return res.status(400).json({
        message: 'Invalid OAuth state'
      });
    }

    // Clear the state cookie after successful validation.
    res.setHeader(
      'Set-Cookie',
      'oidc_state=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/'
    );

    // Exchange authorization code for Google tokens.
    const { tokens } = await oauthClient.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({
        message: 'Google ID token was not returned'
      });
    }

    // Verify the Google ID token.
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        message: 'Invalid Google identity'
      });
    }

    const {
      sub: googleId,
      email,
      name,
      email_verified: emailVerified
    } = payload;

    if (!googleId || !email || !emailVerified) {
      return res.status(400).json({
        message: 'Google account email could not be verified'
      });
    }

    // First try to find the account using Google ID.
    let user = await User.findOne({ googleId });

    // If no Google-linked account exists, check the email.
    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        // Link the verified Google account to the existing user.
        user.googleId = googleId;

        if (!user.name && name) {
          user.name = name;
        }

        await user.save();
      } else {
        // Create a new Google-only StreamLite account.
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          role: 'user'
        });
      }
    }

    // Generate the normal StreamLite JWT.
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    // Create a short-lived one-time code instead of placing
    // the JWT directly in the browser URL.
    const loginCode = createLoginCode();

    loginCodes.set(loginCode, {
      token,
      userId: user._id.toString(),
      name: user.name,
      role: user.role,
      expiresAt: Date.now() + 60 * 1000
    });

    res.redirect(
      `${FRONTEND_URL}/login?oidc_code=${encodeURIComponent(loginCode)}`
    );
  } catch (error) {
    console.error('OIDC callback error:', error);

    res.status(500).json({
      message: 'Google authentication failed'
    });
  }
};

exports.exchangeCode = (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: 'Login code is required'
      });
    }

    const loginData = loginCodes.get(code);

    if (!loginData) {
      return res.status(400).json({
        message: 'Invalid or expired login code'
      });
    }

    // Delete immediately so the code cannot be reused.
    loginCodes.delete(code);

    if (Date.now() > loginData.expiresAt) {
      return res.status(400).json({
        message: 'Invalid or expired login code'
      });
    }

    res.json({
      token: loginData.token,
      userId: loginData.userId,
      name: loginData.name,
      role: loginData.role
    });
  } catch (error) {
    console.error('OIDC exchange error:', error);

    res.status(500).json({
      message: 'Unable to complete Google authentication'
    });
  }
};
