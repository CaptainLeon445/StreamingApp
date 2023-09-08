const express=require("express");
const morgan=require("morgan")
const mongoSanitize=require("express-mongo-sanitize")
const xss=require("xss-clean")
const hpp=require("hpp")
const compression=require("compression")
const app=express()


if (process.env.NODE_ENV==="development"){
    app.use(morgan("dev"))
    app.use((req, res, next)=>{
        console.log("Welcome to my Momento Middlware 🧑‍💼")
        next();
    })
}

app.use(express.json())
// Data Sanitization against NoSql Query Injection
app.use(mongoSanitize())
// Data Sanitization against XSS Attacks
app.use(xss())
// Preventing Parameter Pollution
app.use(hpp())
// Compress text size
app.use(compression())

module.exports=app;