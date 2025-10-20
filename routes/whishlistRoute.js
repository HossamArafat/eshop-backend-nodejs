import { Router } from "express";
import { allow, protect } from "../services/controllers/authService.js";
import {
  addProductToWishlist,
  getProductsFromWishlist,
  removeProductFromWishlist,
} from "../services/controllers/wishlistService.js";
import { addToWshlistValidator } from "../utils/validators/userValidator.js";

const wishlistRouter = Router();

wishlistRouter.use(protect, allow("user"));
wishlistRouter
  .route("/")
  .post(addToWshlistValidator, addProductToWishlist)
  .get(getProductsFromWishlist);

wishlistRouter.delete("/:productId", removeProductFromWishlist);

export default wishlistRouter;
