const User = require("../Model/userModel");
const jwtToken = require("../utils/generateJWToken");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const { generateTimeSlots } = require("../utils/timeSlots");

const filterObj = (obj, ...includeFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (includeFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.authProtect = catchAsyncError(async (req, res, next) => {
  let token;
  // check if there is authorization token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not authorized.", 400));
  }
  // decode the token

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findById(decoded.id);

  // verify the token
  if (!user) {
    return res.status(403).send("Unauthorized");
  }
  if (user.passwordChangedAfter(decoded.iat)) {
    return res
      .status(401)
      .send("Password has been changed since when you last logged in");
  }

  // gain access with the token
  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new AppError("You do not have permission to perform this action.", 400)
      );
    }
    next();
  };
};

exports.signUp = catchAsyncError(async (req, res) => {
  const data = req.body;
  const newUser = await User.create(data);
  const token = jwtToken(newUser._id);
  await generateTimeSlots(newUser._id);
  
  res.status(200).json({
    message: "success",
    token,
    data: newUser,
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Fields cannot be blank", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Email or Password incorrect.", 400));
  }
  const token = jwtToken(user._id);
  res.status(200).json({
    message: "success",
    token,
    user,
  });
});

exports.forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email not found in database.", 400));
  }
  const resetToken = user.createPasswordResetToken();
  user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/v1/api/auth/resetPassword/${resetToken}`;
  const message = `Hi ${user.username},  \n \n Your password reset token is sent and it is valid only for 10min. If you didn't request for this, kindly ignore. Reset your password via this link: ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Momento: Password Reset",
      message,
    });
    res.status(200).json({
      message: "Token sent to your email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    res.status(400).json({
      message: "fail",
      err: err.message,
    });
  }
});

exports.resetPassword = catchAsyncError(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or expired.", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = jwtToken(user._id);
  res.status(200).json({
    message: "success",
    token,
  });
});

exports.updatePassword = catchAsyncError(async (req, res) => {
  const user = await User.findOne(
    new mongoose.Types.ObjectId(req.user.id)
  ).select("+password");
  if (!(await user.comparePassword(req.body.myPassword, user.password))) {
    return next(new AppError("Invalid Password.", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = jwtToken(user._id);
  res.status(200).json({
    message: "success",
    token,
    data: user,
  });
});

exports.updateMe = catchAsyncError(async (req, res) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("This route is not for changing user password.", 400)
    );
  }
  const filterBody = filterObj(
    req.body,
    "username",
    "email",
    "address",
    "state",
    "Nationality"
  );
  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(req.user.id),
    filterBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    message: "success",
    data: user,
  });
});

exports.deleteMe = catchAsyncError(async (req, res) => {
  await User.findByIdAndUpdate(new mongoose.Types.ObjectId(req.user.id), {
    active: false,
  });
  res.status(200).json({
    message: "success",
    data: "User deleted successfully.",
  });
});
