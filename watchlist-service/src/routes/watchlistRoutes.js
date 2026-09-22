const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/watchlist:
 *   post:
 *     summary: Add movie to watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to watchlist
 */
router.post('/', authMiddleware, watchlistController.addToWatchlist);

/**
 * @openapi
 * /api/watchlist/{userId}/{movieId}:
 *   delete:
 *     summary: Remove movie from watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from watchlist
 */
router.delete('/:userId/:movieId', authMiddleware, watchlistController.removeFromWatchlist);

/**
 * @openapi
 * /api/watchlist/{userId}:
 *   get:
 *     summary: Get all items in user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of watchlist items
 */
router.get('/:userId', authMiddleware, watchlistController.getUserWatchlist);

/**
 * @openapi
 * /api/watchlist/{userId}/check/{movieId}:
 *   get:
 *     summary: Check if a movie is in user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check result (true/false)
 */
router.get('/:userId/check/:movieId', authMiddleware, watchlistController.checkIfSaved);

/**
 * @openapi
 * /api/watchlist/status:
 *   post:
 *     summary: Update watchlist item status
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post('/status', authMiddleware, watchlistController.updateStatus);

module.exports = router;
