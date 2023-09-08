const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({

})

const Comments = mongoose.model("Comments", commentSchema)
module.exports = Comments;