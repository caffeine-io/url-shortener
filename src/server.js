import { createServer } from "node:http";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import logger from "./utils/logger.js";

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const server = createServer(app);

    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
