import express from "express";
import {
  createUrlHandler,
  getOriginalUrlHandler,
  getStatsHandler,
} from "../controllers/url.controller.js";
import { createUrlSchema, shortIdSchema } from "../validation/url.schema.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();
/**
 * @swagger
 * /api/urls:
 *   post:
 *     summary: Create a short URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *                 description: The URL to shorten
 *     responses:
 *       201:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL
 *       400:
 *         description: Invalid input
 *       429:
 *         description: Too many requests
 */
router.post("/", validate(createUrlSchema), createUrlHandler);

/**
 * @swagger
 * /api/urls/{shortId}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]{7}$'
 *         description: 7-character alphanumeric short URL identifier
 *     responses:
 *       '200':
 *         description: Original URL
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       '404':
 *         description: URL not found
 *
 */
router.get("/:shortId", validate(shortIdSchema), getOriginalUrlHandler);

/**
 * @swagger
 * /api/urls/{shortId}/stats:
 *   get:
 *     summary: Get URL statistics
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]{7}$'
 *           description: 7-character alphanumeric short URL identifier
 *     responses:
 *       200:
 *         description: URL statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clicks:
 *                   type: number
 *                   description: Number of times the URL was accessed
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: When the URL was created
 *       404:
 *         description: URL not found
 */
router.get("/:shortId/stats", validate(shortIdSchema), getStatsHandler);

export default router;
