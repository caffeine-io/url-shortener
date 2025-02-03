import { z } from "zod";

export const createUrlSchema = z.object({
  body: z.object({
    originalUrl: z.string().url({ message: "Invalid URL format" }),
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
