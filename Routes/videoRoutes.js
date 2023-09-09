const express = require("express");
const {
  GetVideos,
  CreateVideo,
  GetVideo,
  UpdateVideo,
  deleteVideo,
  likeVideo,
  commentVideo,
  EditComment,
  rateVideo,
  replyComments,
} = require("../Controllers/videoController");
const Router = express.Router();

Router.route("/").get(GetVideos).post(CreateVideo);
Router.route("/:videoID").get(GetVideo).patch(UpdateVideo).delete(deleteVideo);
Router.route("/:videoID/likes").post(likeVideo);
Router.route("/:videoID/comment").post(commentVideo).patch(EditComment);
Router.route("/:videoID/comment/reply").post(replyComments);
Router.route("/:videoID/rate").post(rateVideo);

module.exports = Router;
