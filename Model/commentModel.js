const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    video : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos"
    },
    replies : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "replyComments"
        }
    ],
    comment : String,
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Comments = mongoose.model("Comments", commentSchema)
module.exports = Comments;