const mongoose = require("mongoose");

const PlaylistSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    videos : {
        type: mongoose.Schema.ObjectId,
        ref: "Videos"
    },
    video : [String],
    created_at: {
        type: Date,
        default: Date.now()
    }
})
userSchema.index({user: 1, videos: 1})

const Playlists = mongoose.model("Playlists", PlaylistSchema)
module.exports = Playlists;