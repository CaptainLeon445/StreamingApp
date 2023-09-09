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
  replyComments
} = require("../Controllers/videoController");
const { authProtect, restrictTo } = require("../Controllers/authConrollers");

const Router = express.Router();
// Router.use(authProtect)
Router.route("/").get(GetVideos).post(CreateVideo);
Router.route("/:videoID")
  .get(GetVideo)
  .patch(restrictTo("admin,customer"), UpdateVideo)
  .delete(restrictTo("admin,customer"), deleteVideo);
Router.route("/:videoID/likes").post(likeVideo);
Router.route("/:videoID/comment").post(commentVideo).patch(EditComment);
Router.route("/:videoID/comment/reply").post(replyComments);
Router.route("/:videoID/rate").post(rateVideo);

module.exports = Router;
