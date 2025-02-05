import { z } from "zod";

export const createUrlSchema = z.object({
  body: z.object({
    originalUrl: z
      .string()
      .url({ message: "Invalid URL format" })
      .refine(
        (url) => url.startsWith("http://") || url.startsWith("https://"),
        {
          message: "URL must include http:// or https://",
        }
      ),
  }),
});

export const shortIdSchema = z.object({
  params: z.object({
    shortId: z
      .string()
      .length(7)
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Short ID must be 7 alphanumeric characters",
      }),
  }),
});
