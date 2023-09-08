const AppError = require("./appError")

const sendDevError=(err, res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    error:err, 
    message:err.message,
    stack:err.stack
  })
}
const sendProdError=(err, res)=>{
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }
  // else if(err.code === 'ENOTFOUND') {
  //   res.status(503).json({
  //     status: "Error", 
  //     message: "Unable to connect to the server/internet. Please try again."
  //   })
  //   // return res.status(503).json({ error: 'Service temporarily unavailable.' });
  // }
  else{
    console.error("Production Error 💥", err)
    res.status(500).json({
      status: "Error", 
      message: "Unable to connect to the server/internet. Please try again."
    })
  }
}
const handleCastErrorDB=(err)=>{
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}
const handleTokenExpired=(err)=>{
  const message = "Token Expired. Please login again."
  return new AppError(message, 500)
}
const handleDuplicateFieldsDB=(err)=>{
  const errKey=Object.keys(err.keyValue)
  const errValue = err.keyValue[errKey];
  const message = ` ${errValue} is found in the Database. Please provide a unique ${errKey}`
  return new AppError(message, 400)
}
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `${errors.join('. ')}`;
  return new AppError(message, 400);
};


module.exports=(err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
 
    if (process.env.NODE_ENV==="development"){
      sendDevError(err, res)
    }else if(process.env.NODE_ENV==="production"){
      let error = {...err};
      if (err.name === 'CastError') error =handleCastErrorDB(error)
      if (error.code === 11000) error =handleDuplicateFieldsDB(error)
      if (err.name === 'ValidationError') error = handleValidationErrorDB(error)
      if (err.name === 'TokenExpiredError') error = handleTokenExpired(error)

      // if (error.code === 'ENOTFOUND') error = InternetError(error)
      sendProdError(error, res)
    }
}