const express = require('express');
const router = express.Router();
const playbackController = require('../controllers/playbackController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/playback/start:
 *   post:
 *     summary: Start playback for a movie
 *     tags: [Playback]
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
 *       200:
 *         description: Playback stream URL and info
 */
router.post('/start', authMiddleware, playbackController.startPlayback);

/**
 * @openapi
 * /api/playback/history:
 *   post:
 *     summary: Save user playback history
 *     tags: [Playback]
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
 *               progress:
 *                 type: number
 *     responses:
 *       201:
 *         description: History saved
 */
router.post('/history', authMiddleware, playbackController.saveHistory);

/**
 * @openapi
 * /api/playback/history/{userId}:
 *   get:
 *     summary: Get playback history for a user
 *     tags: [Playback]
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
 *         description: User playback history
 */
router.get('/history/:userId', authMiddleware, playbackController.getHistory);

/**
 * @openapi
 * /api/playback/continue/{userId}:
 *   get:
 *     summary: Get movies the user is currently watching
 *     tags: [Playback]
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
 *         description: Continue watching list
 */
router.get('/continue/:userId', authMiddleware, playbackController.getContinueWatching);

/**
 * @openapi
 * /api/playback/complete:
 *   post:
 *     summary: Mark a movie as completely watched
 *     tags: [Playback]
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
 *       200:
 *         description: Movie completed status updated
 */
router.post('/complete', authMiddleware, playbackController.completeMovie);

module.exports = router;
