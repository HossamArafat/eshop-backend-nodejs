import expressAsyncHandler from "express-async-handler";
import userModel from "../../models/userModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";
import bcrypt from "bcrypt";
import createToken from "../../utils/createToken.js";

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/admin
const createUser = createOne(userModel);

// @desc    Get list of users /pagination
// @route   GET /api/v1/users
// @access  Private/admin-manger
const getUsers = getAll(userModel);

// @desc    Get specific user
// @route   GET api/v1/users/:id
// @access  Private/admin-manger
const getUserById = getOne(userModel);

// @desc    Update specific user
// @route   PUT api/v1/users/:id
// @access  Private/admin-manger
const updateUser = updateOne(userModel);

// @desc    Update specific user password
// @route   PUT api/v1/users/change-password/:id
// @access  Private/admin
const changeUserPass = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const newDoc = await userModel.findByIdAndUpdate(
    id,
    { password: hashedPassword, passwordChangedAt: Date.now() },
    { new: true }
  );
  res.status(200).json({ data: newDoc });
});

// @desc    Delete specific user
// @route   DELETE api/v1/users/:id
// @access  Private/admin
const deleteUser = deleteOne(userModel);

// LOGGED USER

// @desc    Get logged user
// @route   GET api/v1/users/get-me
// @access  Private/user
const getMe = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user data
// @route   PUT api/v1/users/update-me
// @access  Private/user
const updateMe = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  const { name, phone, email } = req.body;
  req.body = { name, phone, email };
  next();
});

// @desc    Update logged user pass
// @route   PUT api/v1/users/change-my-password
// @access  Private/user
const changeMyPass = expressAsyncHandler(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { password: hashedPassword, passwordChangedAt: Date.now() },
    { new: true }
  );

  const token = createToken({ userId: user._id });

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user active {deactivate, activate}
// @route   DELETE api/v1/users/delete-me
// @access  Private/user
const deleteMe = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { active: req.body.active },
    { new: true }
  );

  res.status(200).json({ Status: "Success" });
});

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserPass,
  deleteUser,
  getMe,
  updateMe,
  changeMyPass,
  deleteMe,
};
