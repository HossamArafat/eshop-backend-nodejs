import { Router } from "express";
import { addProductToCart, applyCouponOnCart, clearCart, getCart, removeSpecificProduct, updateSpecificProductQty } from "../services/controllers/cartService.js";
import { allow, protect } from "../services/controllers/authService.js";


const cartRouter = Router();
cartRouter.use(protect, allow('user'))

cartRouter
  .route("/")
  .get(getCart)
  .post(addProductToCart)
  .put(applyCouponOnCart)
  .delete(clearCart);

cartRouter
  .route("/:id")
  .put(updateSpecificProductQty)
  .delete(removeSpecificProduct)

export default cartRouter;
