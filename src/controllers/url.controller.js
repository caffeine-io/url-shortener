import {
  createShortUrl,
  getOriginalUrl,
  getUrlStats,
} from "../services/url.service.js";
import logger from "../utils/logger.js";

export const createUrlHandler = async (req, res) => {
  try {
    const shortUrl = await createShortUrl(req.body.originalUrl);
    res.status(201).json({ shortUrl });
  } catch (error) {
    logger.error("Error creating short URL:", error);
    res.status(500).json({ error: "Failed to create short URL" });
  }
};

export const getOriginalUrlHandler = async (req, res) => {
  try {
    const originalUrl = await getOriginalUrl(req.params.shortId);
    originalUrl
      ? res.redirect(originalUrl)
      : res.status(404).json({ error: "URL not found" });
  } catch (error) {
    res.status(500).json({ error: "Redirect failed" });
  }
};

export const getStatsHandler = async (req, res) => {
  try {
    const stats = await getUrlStats(req.params.shortId);
    stats ? res.json(stats) : res.status(404).json({ error: "URL not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to get stats" });
  }
};
