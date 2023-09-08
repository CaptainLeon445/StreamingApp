const mongoose = require("mongoose");


const ratingSchema = mongoose.Schema({
    rating : Number,
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    video : {
        type: mongoose.Schema.ObjectId,
        ref: "Videos"
    }
})

const ratings = mongoose.model("ratings", ratingSchema)
module.exports = ratings;