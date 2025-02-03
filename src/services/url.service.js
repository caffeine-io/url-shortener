import {
  createUrl,
  findByOriginalUrl,
  findUrlByShortId,
  incrementUrlClicks,
} from "../repositories/url.repository.js";
import { generateShortId } from "../utils/base64.js";
import logger from "../utils/logger.js";

export const createShortUrl = async (originalUrl) => {
  try {
    // Check if URL already exists
    const existingUrl = await findByOriginalUrl(originalUrl);
    if (existingUrl) {
      logger.info(`Existing URL found for: ${originalUrl}`);
      return existingUrl.shortId;
    }

    // Generate short ID and create new URL
    const shortId = generateShortId();
    console.log(shortId);
    const url = await createUrl(originalUrl, shortId);
    logger.info(`Created new short URL: ${process.env.BASE_URL}/${shortId}`);
    console.log(url.shortId);
    return url.shortId;
  } catch (error) {
    logger.error("Error creating short URL:", error);
    throw error;
  }
};

export const getOriginalUrl = async (shortId) => {
  try {
    const url = await incrementUrlClicks(shortId);
    if (!url) {
      logger.warn(`URL not found for shortId: ${shortId}`);
      throw new Error("URL not found");
    }
    return url?.originalUrl;
  } catch {
    logger.error(`Error retrieving URL for ${shortId}:`, error);
    throw error;
  }
};

export const getUrlStats = async (shortId) => {
  try {
    const url = await findUrlByShortId(shortId);
    if (!url) {
      logger.warn(`URL not found for shortId: ${shortId}`);
      throw new Error("URL not found");
    }
    return url ? { clicks: url.clicks, createdAt: url.createdAt } : null;
  } catch (error) {
    logger.error(`Error retrieving URL for ${shortId}:`, error);
    throw error;
  }
};
