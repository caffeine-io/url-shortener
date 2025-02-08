import { URL } from "../models/url.model.js";

export const findByOriginalUrl = async (originalUrl) => {
  return URL.findOne({ originalUrl });
};

export const createUrl = async (originalUrl, shortId) => {
  return URL.create({ originalUrl, shortId });
};

export const findUrlByShortId = async (shortId) => {
  return URL.findOne({ shortId });
};

export const findUrlAndUpdate = async (originalUrl, shortId) => {
  return URL.findOneAndUpdate(
    { originalUrl },
    { $setOnInsert: { originalUrl, shortId } },
    {
      upsert: true,
      new: true,
      runValidators: true,
      includeResultMetadata: true,
    }
  );
};

export const incrementUrlClicks = async (shortId) => {
  return URL.findOneAndUpdate(
    { shortId },
    { $inc: { clicks: 1 } },
    { new: true }
  );
};
