const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./dotenv.config" });
const app = require("./middlewares");

const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const videoRoutes = require("./Routes/videoRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/globalErrorHandler");
const { logger } = require("./logger");
app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/users", userRoutes);
app.use("/v1/api/videos", videoRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
let DB = process.env.DATABASE_DEV;
let port = 3000;
if (process.env.NODE_ENV === "production") {
  DB = process.env.DATABASE_PROD.replace(
    // "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );
  port = process.env.PORT;
}

handleConnectionRefused = () => {
  const message = `Unable to connect to the server. Please try again later.`;
  return new AppError(message, 500);
};
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log();
    logger.info(`Database connected successfully on port ${port}`);
  })
  .catch((err) => {
    if (err.code === "ECONNREFUSED") {
      handleConnectionRefused();
    } else {
      logger.info(`There is error in connecting the database to port ${port}`);
    }
  });

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}...🏃`);
});

process.on("unhandledRejection", (err) => {
  logger.info(err.name, ":", err.message);
  logger.info("UNHANDLED REJECTION 💥 Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, ":", err.message);
  console.log("UNCAUGHT EXCEPTION 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
