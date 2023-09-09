const mongoose = require("mongoose");


const likeSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    video : {
        type: mongoose.Schema.ObjectId,
        ref: "Videos"
    },
    like : {
        type: Boolean,
        default: true
    }
})

const likes = mongoose.model("likes", likeSchema)
module.exports = likes;