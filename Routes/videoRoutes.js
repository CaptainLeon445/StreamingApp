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
} = require("../Controllers/videoController");
const { authProtect, restrictTo } = require("../Controllers/authConrollers");

const Router = express.Router();
Router.use(authProtect);
Router.route("/").get(GetVideos).post(CreateVideo);
Router.route("/:videoID").get(GetVideo).patch(UpdateVideo).delete(deleteVideo);

Router.route("/:videoID/likes").post(likeVideo);

Router.route("/user/comments")
  .get(getComments)


Router.route("/:videoID/comment")
  .post(commentVideo)
  .patch(EditComment)
  .delete(deleteComment);

Router.route("/:videoID/comment/reply").post(replyComments);

Router.route("/:videoID/rate").post(rateVideo);

module.exports = Router;
