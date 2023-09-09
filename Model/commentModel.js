const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    video : {
        type: mongoose.Schema.ObjectId,
        ref: "Videos"
    },
    comment : String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Comments = mongoose.model("Comments", commentSchema)
module.exports = Comments;