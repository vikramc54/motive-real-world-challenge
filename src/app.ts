import express from "express";
import setupCorsMiddleware from "./middleware/cors-setup";
import setupLoggerMiddleware from "./middleware/logger";
import router from "./routes/index";
import errorHandler from "./middleware/errors";

const app = express();

// Function to setup cors handling for the application
setupCorsMiddleware(app);

// Express body parser for application/json and application/x-www-form-urlencoded
app.use(express.json({ limit: "1024mb" }));
app.use(express.urlencoded({ extended: true }));

// Setup logger middleware
setupLoggerMiddleware(app);

// Setup routes from router
app.use(router.valueOf());

// Custom error handler which handles synchronous errors
app.use(errorHandler);

export default app;
