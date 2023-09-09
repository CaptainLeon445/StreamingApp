const mongoose = require("mongoose");

const replyCommentSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    comment : {
        type: mongoose.Schema.ObjectId,
        ref: "Comments"
    },
    reply : String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const replyComments = mongoose.model("replyComments", replyCommentSchema)
module.exports = replyComments;