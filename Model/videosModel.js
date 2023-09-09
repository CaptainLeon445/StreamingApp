const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref : "Users"
    },
    title:{
        type: String ,
        required:[true, "Please add title"],
    },
    descrition:{
        type:String,
    },
    video: String,
    playlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Playlist",
    }],
    paid: {
        type : Boolean,
        default : false
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Videos = mongoose.model("Videos", videoSchema)
module.exports = Videos;