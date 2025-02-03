import express from "express";
import cors from "cors";

import { apiLimiter } from "./middleware/rateLimit.js";
import urlRoutes from "./routes/url.route.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cors());
app.use(apiLimiter);
// Swagger documentation
if (process.env.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
// Routes
app.use("/api/urls", urlRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: "error",
    message: err.message || "Something went wrong!",
  });
});

export default app;
