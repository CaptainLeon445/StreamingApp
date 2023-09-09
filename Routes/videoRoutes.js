const express=require("express")
const { GetVideos, CreateVideo, GetVideo, UpdateVideo, deleteVideo, likeVideo, commentVideo, EditComment } = require("../Controllers/videoController")
const Router=express.Router()


Router.route("/").get(GetVideos).post(CreateVideo)
Router.route("/:videoID").get(GetVideo).patch(UpdateVideo).delete(deleteVideo)
Router.route("/:videoID/likes").post(likeVideo)
Router.route("/:videoID/comment").post(commentVideo).patch(EditComment)


module.exports = Router;