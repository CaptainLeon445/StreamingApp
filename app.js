const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./dotenv.config" });
const app = require("./middlewares");

const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const videoRoutes = require("./Routes/videoRoutes")

const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/globalErrorHandler");

app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/users", userRoutes);
app.use("v1/api/videos", videoRoutes);

app.all("*", (req, res, next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)

let DB = process.env.DATABASE_DEV;
let port = 8000;
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
    console.log(`Database connected successfully on port ${port}`);
  })
  .catch((err) => {
    if (err.code === 'ECONNREFUSED') {handleConnectionRefused()}
    else{console.log(
      `There is error in connecting the database to port ${port}`,
      err
    )};

  });

const server=app.listen(port, () => {
  console.log(`Server running on port ${port}...🏃`);
});

process.on("unhandledRejection", (err)=>{
  console.log(err.name,":",err.message)
  console.log("UNHANDLED REJECTION 💥 Shutting down...")
  server.close(()=>{
    process.exit(1)
  })
})

process.on("uncaughtException", (err)=>{
  console.log(err.name,":",err.message)
  console.log("UNCAUGHT EXCEPTION 💥 Shutting down...")
  server.close(()=>{
    process.exit(1)
  })
})
