const express=require("express")
const { GetVideos, CreateVideo, GetVideo, UpdateVideo, deleteVideo } = require("../Controllers/videoController")
const Router=express.Router()


Router.route("/").get(GetVideos, CreateVideo)
Router.route("/:videoID").get(GetVideo, UpdateVideo, deleteVideo)