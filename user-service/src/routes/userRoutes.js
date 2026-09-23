const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const oidcController = require('../controllers/oidcController');

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (validation error)
 */
router.post('/register', userController.register);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', userController.login);

/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile info
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @openapi
 * /api/users/auth/oidc:
 *   get:
 *     summary: Start Google OpenID Connect authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google authentication
 */
router.get('/auth/oidc', oidcController.startLogin);

/**
 * @openapi
 * /api/users/auth/oidc/callback:
 *   get:
 *     summary: Handle Google OpenID Connect callback
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects back to the frontend
 */
router.get('/auth/oidc/callback', oidcController.callback);

/**
 * @openapi
 * /api/users/auth/oidc/exchange:
 *   post:
 *     summary: Exchange one-time OIDC login code for StreamLite JWT
 *     tags: [Authentication]
 */
router.post('/auth/oidc/exchange', oidcController.exchangeCode);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
// router.get('/:id', userController.getUserById);
router.get('/:id', authMiddleware, userController.getUserById);

/**
 * @openapi
 * /api/users/validate/{id}:
 *   get:
 *     summary: Validate if user exists (internal microservice use)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User is valid
 *       404:
 *         description: User not found
 */
router.get('/validate/:id', userController.validateUser);

module.exports = router;
