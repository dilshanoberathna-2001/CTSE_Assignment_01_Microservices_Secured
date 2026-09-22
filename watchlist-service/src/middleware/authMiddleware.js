const jwt = require('jsonwebtoken');

const sendError = (res, status, code, message) => {
  return res.status(status).json({ code, message });
};

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return sendError(res, 401, 'UNAUTHORIZED', 'No token, authorization denied');
  }

  try {
    const formattedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(formattedToken, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    return sendError(res, 401, 'INVALID_TOKEN', 'Token is not valid');
  }
};

module.exports = authMiddleware;
