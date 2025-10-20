import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserPass,
  getMe,
  updateMe,
  changeMyPass,
  deleteMe,
} from "../services/controllers/userService.js";
import {
  userIdValidator,
  changePassValidator,
  updateUserValidator,
  createUserValidator,
} from "../utils/validators/userValidator.js";
import { storeProcessImg, uploadProfileImg } from "../middlewares/express-middleware/uploadImgMiddleware.js";
import { allow, protect } from "../services/controllers/authService.js";

const userRouter = Router();

const setFolderName = (req, res, next) => {
  req.folderName = 'user'
  next()
}

userRouter.use(protect)

// LOGGED USER
userRouter.get("/get-me", getMe, getUserById)
userRouter.put("/update-me", updateUserValidator, updateMe, updateUser)
userRouter.put("/change-my-password", changePassValidator, changeMyPass)
userRouter.delete("/delete-me", deleteMe)

// ADMIN
userRouter.get("/", allow('manager', 'admin', 'user'), getUsers)
userRouter.use(allow('manager', 'admin'))
userRouter
  .route("/")
  .post(setFolderName, uploadProfileImg, createUserValidator, storeProcessImg, createUser);

userRouter
  .route("/:id")
  .get(userIdValidator, getUserById)
  .delete(userIdValidator, deleteUser)
  .put(setFolderName, uploadProfileImg, userIdValidator, updateUserValidator, storeProcessImg, updateUser);

userRouter.put("/change-password/:id", userIdValidator, changePassValidator, changeUserPass)

export default userRouter;
