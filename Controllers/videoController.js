const AppError = require("../utils/appError");
const catchAsyncError = require("../utils/catchAsyncError");
const likes = require("../Model/likesModel");
const Comments = require("../Model/commentModel");
const ratings = require("../Model/ratingsModel");
const replyComments = require("../Model/replyCommentModel");
const Videos = require("../Model/videosModel");
const multer = require("multer");
const { logger } = require("../logger");
const cache = require('memory-cache');
// `##################################
//  ###                            ###
//  ###     videos upload          ###
//  ###                            ###
//  ##################################`

exports.upload = multer({ storage: multer.memoryStorage() });

exports.GetVideos = catchAsyncError(async (req, res, next) => {
  const data = await Videos.find();
  const result = await getDataFromCache("videos", data)
  res.status(200).json({
    message: "Success",
    result,
  });
});
exports.UpdateVideo = catchAsyncError(async (req, res, next) => {
  const videoID = req.params.videoID;
  const video = await Videos.findById(videoID);
  const id = video.id;
  const data = await Videos.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    message: "Success",
    data,
  });
});
exports.deleteVideo = catchAsyncError(async (req, res, next) => {
  const data = await Videos.findByIdAndDelete(req.params.videoID);
  if (!data) {
    return next(new AppError("No Video with the id", 400));
  }
  return res.status(204).json({
    message: "Success",
    data,
  });
});
exports.CreateVideo = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const file = req.file;
  //   console.log(file)
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  const videoPath = await uploadFileToS3(file);
  req.body.video = videoPath;
  const content = req.body;
  const data = await Videos.create(content);
  logger.info("Request received for creation of video.");
  return res.status(201).json({
    mesaage: "success",
    data,
  });
});

exports.GetVideo = catchAsyncError(async (req, res, next) => {
  const data = await Videos.findById(req.params.videoID);
  if (!data) {
    return next(new AppError("No Video with the id", 400));
  }
  const result = await getDataFromCache("video", data)

  return res.status(200).json({
    message: "Success",
    result
  });
});

// `##################################
//  ###                            ###
//  ###     stream videos          ###
//  ###                            ###
//  ##################################`
const { multiPart, uploadFileToS3 } = require("../fileStorage");
const { getDataFromCache } = require("../caching");

exports.StreamVideo = catchAsyncError(async (req, res, next) => {
  const video = await Videos.findById(req.params.videoID);

  if (!video) {
    return res.sendStatus(404);
  }
  return res.redirect(video.video);
});

// `##################################
//  ###                            ###
//  ###     Create Playlist        ###
//  ###                            ###
//  ##################################`

exports.createPlaylist = catchAsyncError(async (req, res, next) => {
  const user = req.user.id;
  const videoID = req.params.videoID;
  const videoData = await Videos.findById(videoID);
  if (!videoData) {
    return next(new AppError("Video not found"), 404);
  }
  const { video } = req.body;
  const data = await replyComments.create({
    user,
    videos: videoData.id,
    video,
  });
  await Videos.findByIdAndUpdate(
    videoData.id,
    {
      user,
      playlist: data.id,
    },
    {
      new: true,
    }
  );
  return res.status(201).json({
    mesaage: "Success",
    data,
  });
});

// `#########################
//  ###                   ###
//  ###   "LIKE VIDEOS"   ###
//  ###                   ###
//  #########################`

exports.likeVideo = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const video = await Videos.findById(userId);
  const likedVideos = await likes.find({
    user: userId,
    video: req.params.videoID,
  });
  if (video) {
    return next(new AppError("Video can only be liked by other users"), 400);
  }
  if (likedVideos) {
    const likeID = likedVideos.id;
    const data = await await likes.findByIdAndUpdate(
      likeID,
      { like: false },
      {
        new: true,
      }
    );
    return res.status(201).json({
      message: "Unliked Successfully",
      data,
    });
  }
  const content = {
    user: userId,
    video: req.params.videoID,
  };
  const data = await likes.create(content);
  return res.status(201).json({
    mesaage: "Liked Successfully",
    data,
  });
});

// `##################################
//  ###                            ###
//  ###     Comment on  VIDEOS     ###
//  ###                            ###
//  ##################################`

exports.commentVideo = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const video = await Videos.findById({user:userId});
  if (video) {
    return next(
      new AppError("Video can only be commented by other users"),
      400
    );
  }
  const content = {
    user: userId,
    video: req.params.videoID,
    comment: req.body.comment,
  };
  const data = await Comments.create(content);
  return res.status(201).json({
    mesaage: "Success",
    data,
  });
});

exports.getComments = catchAsyncError(async (req, res, next) => {
  const data = await Comments.find();
  const result = await getDataFromCache("comments", data)

  return res.status(200).json({
    mesaage: "Success",
    results: result.length,
    result,
  });
});

exports.EditComment = catchAsyncError(async (req, res, next) => {
  const paramsId = req.params.commentId;
  const comment = req.body;
  const data = await Comments.findByIdAndUpdate(paramsId, comment, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    message: "Success",
    data,
  });
});

exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const paramsId = req.params.commentId;
  const data = await Comments.findByIdAndDelete(paramsId);
  if (!data) {
    return next(new AppError("No Comment with the id", 400));
  }
  return res.status(204).json({
    message: "Comment deleted Successfully!",
    data,
  });
});

// `##################################
//  ###                            ###
//  ###     Reply to Comments      ###
//  ###                            ###
//  ##################################`

exports.replyComments = catchAsyncError(async (req, res, next) => {
  const user = req.user.id;
  const commentId = req.params.commentId;
  const comment = await Comments.findById(commentId);
  if (!comment) {
    return next(new AppError("Comment not found"), 404);
  }
  const { reply } = req.body;
  const data = await replyComments.create({
    user,
    comment: comment.id,
    reply,
  });
  await Comments.findByIdAndUpdate(
    comment.id,
    {
      user,
      video: req.params.videoID,
      replies: data.id,
    },
    {
      new: true,
    }
  );
  return res.status(201).json({
    mesaage: "Success",
    data,
  });
});

// `##################################
//  ###                            ###
//  ###     Rate  VIDEOS           ###
//  ###                            ###
//  ##################################`

exports.rateVideo = catchAsyncError(async (req, res, next) => {
  const params = req.params.videoID;
  const video = await Videos.findById(params);
  if (!video) {
    return next(new AppError("Video with the ID not found."), 400);
  }
  const content = {
    user: req.user.id,
    video: req.params.videoID,
    rating: req.body.rating,
  };
  const data = await ratings.create(content);
  return res.status(201).json({
    mesaage: "Success",
    data,
  });
});
