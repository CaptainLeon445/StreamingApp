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
  deleteComment,
  getComments,
  upload,
  StreamVideo,
} = require("../Controllers/videoController");
const { authProtect, restrictTo } = require("../Controllers/authConrollers");

const Router = express.Router();
Router.use(authProtect);
Router.route("/").get(GetVideos).post(upload.single("video"), CreateVideo);
Router.route("/:videoID").get(GetVideo).patch(UpdateVideo).delete(deleteVideo);
Router.route("/:videoID/stream").get(StreamVideo);
Router.route("/:videoID/likes").post(likeVideo);

Router.route("/user/comments").get(getComments);

Router.route("/:videoID/comment").post(commentVideo);
Router.route("/:commentId/comment").patch(EditComment).delete(deleteComment);
Router.route("/:commentId/comment/reply").post(replyComments);

Router.route("/:videoID/rate").post(rateVideo);
// /64fd9e1e4cf4012b6e3aa742/comment
module.exports = Router;
