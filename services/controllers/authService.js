import expressAsyncHandler from "express-async-handler";
import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../../utils/apiError.js";
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail.js";
import createToken from "../../utils/createToken.js";
import { sanitizeUser } from "../../utils/sanitizeData.js";

//AUTHENTICATION (signup, login, protect)

// @desc    Sigup
// @route   POST api/v1/auth/signup
// @access  Public
const signup = expressAsyncHandler(async (req, res, next) => {
  // create user
  const { name, email, password } = req.body;
  const user = await userModel.create({
    name: name,
    email: email,
    password: password,  // hashed password is done in pre-save middleware
  });

  // generate token
  const token = createToken({ userId: user._id });

  res.status(201).json({ data: sanitizeUser(user), token });
});

// @desc    Login
// @route   POST api/v1/auth/login
// @access  Public
const login = expressAsyncHandler(async (req, res, next) => {
  // verify user credentials [email, password]
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  const hashedPassword = user
    ? await bcrypt.compare(password, user.password)
    : false;
  if (!user || !hashedPassword) {
    return next(new ApiError("Incorrect email or password.", 401));
  }

  // generate token
  const token = createToken({ userId: user._id });
  res.status(200).json({ data: sanitizeUser(user), token });
});

const protect = expressAsyncHandler(async (req, res, next) => {
  // verify if token exists or Not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  else
    return next(
      new ApiError(
        "You are not logged in, please login first to access this route.",
        401
      )
    );

  // verify if token is correct (invalid, expired)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    const msg =
      err.name == "JsonWebTokenError"
        ? "Invalid token"
        : err.name == "TokenExpiredError"
          ? "Exoired token"
          : "Token error";
    return next(new ApiError(`${msg}, please login again...`, 401));
  }

  // verify if user of this token still exists or deleted
  const currUser = await userModel.findById(decoded.userId);
  if (!currUser)
    return next(new ApiError("The user belonged to this token is deleted."));

  // Verify if password is changed
  if (currUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currUser.passwordChangedAt.getTime() / 1000
    );
    if (passChangedTimestamp > decoded.iat)
      return next(
        new ApiError(
          "User recently changed password, please login again...",
          401
        )
      );
  }

  req.user = currUser;
  next();
});

// AUTHORIZATION (allow)

const allow = (...roles) =>
  expressAsyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("User is not allowd to access this route.", 403)
      );
    next();
  });

// FORGET PASSWORD (forgot, verify, rest)

// @desc    Forgot password
// @route   POST api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = expressAsyncHandler(async (req, res, next) => {
  // verify if email exists
  const user = await userModel.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`There is user for this email ${req.body.email}`),
      404
    );

  // generate reset code 6 digits, hashed, and expire date
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedCode;
  user.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  const message = `
  <p><b> Hi ${user.name}</b>,</b>
  <p></p>We received a request to reset the password on your E-Shop Account.</p>
  <h3>${resetCode}</h3>
  <p>Enter this code to complete the rest.</p>
  <p>Thanks for helping us keep you account secure.</p>
  <p><b>The E-Shop Team</b></p>`;

  // send mail
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
    await user.save();
  } catch (err) {
    return next(new ApiError("There is an error in sending email", 500));
  }

  res.status(200).json({
    status: "Success",
    message: "Reset password code sent to email successfully.",
  });
});

// @desc    Verify reset code
// @route   POST api/v1/auth/verifyResetCode
// @access  Public
const verifyResetCode = expressAsyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashedCode,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user)
    return next(new ApiError("Reset password code invalid or expired.", 404));

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
    message: "Reset password code verified successfully.",
  });
});

// @desc    Reset password
// @route   POST api/v1/auth/resetPassword
// @access  Public
const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`There is user for this email ${req.body.email}`, 404)
    );
  if (!user.passwordResetVerified)
    return next(new ApiError("Reset password code is not verified", 404));

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpired = undefined;
  user.passwordResetVerified = false;
  await user.save();

  const token = createToken({ userId: user._id });
  res.status(200).json({
    status: "Success",
    message: "Password reset successfully.",
    token,
  });
});

export {
  signup,
  login,
  protect,
  allow,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
