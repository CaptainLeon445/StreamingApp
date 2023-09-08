const User = require("../Model/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsyncError");

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  const filter = req.query;

  let users = await User.find();
  
  if (Object.keys(filter).length > 0) {
    const conditions = [];

    // Build conditions for each search query parameter
    for (const key in filter) {
      const searchQuery = filter[key];
      const regexPattern = new RegExp(searchQuery, "i");
      conditions.push({ [key]: { $regex: regexPattern } });
    }
    users = await User.find({ $and: conditions });
  }

  res.status(200).json({
    message: "success",
    results: users.length,
    data: users,
  });
});
exports.CreateUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    message: "success",
    data: user,
  });
});
exports.UpdateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("No user found with the ID", 400));
  }
  res.status(201).json({
    message: "success",
    data: user,
  });
});
exports.GetUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with the ID", 400));
  }
  res.status(200).json({
    message: "success",
    data: user,
  });
});
exports.DeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with the ID", 400));
  }
  res.status(204).json({
    status: "success",
    data: "User deleted successfully.",
  });
});
