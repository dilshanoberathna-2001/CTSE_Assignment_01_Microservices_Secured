const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

/**
 * @openapi
 * /api/catalog:
 *   post:
 *     summary: Add a new movie
 *     tags: [Catalog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               genre:
 *                 type: string
 *               thumbnailUrl:
 *                 type: string
 *               trailerUrl:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Movie added successfully
 */
router.post('/', catalogController.addMovie);

/**
 * @openapi
 * /api/catalog:
 *   get:
 *     summary: Get all movies
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: List of all movies
 */
router.get('/', catalogController.getAllMovies);

/**
 * @openapi
 * /api/catalog/search:
 *   get:
 *     summary: Search movies by query
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search text
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', catalogController.searchMovies);

/**
 * @openapi
 * /api/catalog/{movieId}:
 *   get:
 *     summary: Get specific movie details
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 */
router.get('/:movieId', catalogController.getMovieById);

/**
 * @openapi
 * /api/catalog/{movieId}/stream-info:
 *   get:
 *     summary: Get stream information for playback
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stream details (URL and duration)
 *       404:
 *         description: Movie not found
 */
router.get('/:movieId/stream-info', catalogController.getStreamInfo);

module.exports = router;
