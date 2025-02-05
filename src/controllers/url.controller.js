import {
  createShortUrl,
  getOriginalUrl,
  getUrlStats,
} from "../services/url.service.js";
import { createUrlSchema, shortIdSchema } from "../validation/url.schema.js";
import logger from "../utils/logger.js";

export const createUrlHandler = async (req, res) => {
  const validation = createUrlSchema.safeParse(req);
  if (!validation.success) {
    return res.status(400).json({
      errors: validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  try {
    const shortUrl = await createShortUrl(req.body.originalUrl);
    res.status(201).json({ shortUrl });
  } catch (error) {
    logger.error("Error creating short URL:", error);
    res.status(500).json({ error: "Failed to create short URL" });
  }
};

export const getOriginalUrlHandler = async (req, res) => {
  const idValidation = shortIdSchema.safeParse(req);
  if (!idValidation.success) {
    logger.warn("Invalid short ID format attempt", {
      shortId: req.params.shortId,
      errors: idValidation.error.errors,
    });
    return res.status(404).json({ error: "URL not found" });
  }
  try {
    const originalUrl = await getOriginalUrl(req.params.shortId);
    if (!originalUrl) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json(originalUrl);
  } catch (error) {
    logger.error(
      `Failed to get original URL for ${req.params.shortId}:`,
      error
    );
    res.status(500).json({ error: "Failed to get original URL" });
  }
};

export const getStatsHandler = async (req, res) => {
  const idValidation = shortIdSchema.safeParse(req);
  if (!idValidation.success) {
    logger.warn("Invalid short ID format attempt", {
      shortId: req.params.shortId,
      errors: idValidation.error.errors,
    });
    return res.status(404).json({ error: "URL not found" });
  }
  try {
    const stats = await getUrlStats(req.params.shortId);
    if (!stats) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.json(stats);
  } catch (error) {
    logger.error(`Failed to get stats for ${req.params.shortId}:`, error);
    res.status(500).json({ error: "Failed to get stats" });
  }
};
