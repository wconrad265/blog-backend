const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

mongoose.set("strictQuery", false);

logger.info(`Connecting to ${MONGODB_URI}`);

mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error("error connecting to MongoDB: ", error.message)
  );

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);

app.use(middleware.tokenExtractor, middleware.userExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
