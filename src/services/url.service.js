import {
  findByOriginalUrl,
  findUrlAndUpdate,
  findUrlByShortId,
  incrementUrlClicks,
} from "../repositories/url.repository.js";
import { generateShortId } from "../utils/base64.js";
import logger from "../utils/logger.js";

export const createShortUrl = async (originalUrl) => {
  try {
    const shortId = generateShortId();
    const url = await findUrlAndUpdate(originalUrl, shortId);
    // Check if the document was newly created
    const isNew = !url.lastErrorObject.updatedExisting;
    logger.info(
      `Short URL: ${process.env.BASE_URL}/${url.value.shortId}, isNew: ${isNew}`
    );
    return { shortUrl: url.value.shortId, isNew: isNew };
  } catch (error) {
    if (error.code === 11000) {
      // Handle race condition: Another request already inserted the URL
      const existingUrl = await findByOriginalUrl(originalUrl);
      return { shortUrl: existingUrl.shortId, isNew: false };
    }
    logger.error("DB Error creating short URL:", error);
    throw error;
  }
};

export const getOriginalUrl = async (shortId) => {
  try {
    const url = await incrementUrlClicks(shortId);
    if (!url) {
      logger.warn(`URL not found for shortId: ${shortId}`);
      return null;
    }
    return url.originalUrl;
  } catch (error) {
    logger.error(`DB Error retrieving URL for ${shortId}:`, error);
    throw error;
  }
};

export const getUrlStats = async (shortId) => {
  try {
    const url = await findUrlByShortId(shortId);
    if (!url) {
      logger.warn(`URL not found for shortId: ${shortId}`);
      return null;
    }
    return url ? { clicks: url.clicks, createdAt: url.createdAt } : null;
  } catch (error) {
    logger.error(`DB Error retrieving URL for ${shortId}:`, error);
    throw error;
  }
};
