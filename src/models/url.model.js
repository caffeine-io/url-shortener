import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
urlSchema.index({ shortId: 1 }, { unique: true });
urlSchema.index({ originalUrl: 1 }, { unique: true });
export const URL = mongoose.model("URL", urlSchema);
