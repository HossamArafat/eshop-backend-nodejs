import { Router } from "express";
import { allow, protect } from "../services/controllers/authService.js";
import { addAddress, getAddresses, removeAddress, updateAddress } from "../services/controllers/addressService.js";
import { updateUserValidator } from "../utils/validators/userValidator.js";

const addressRouter = Router();

addressRouter.use(protect, allow("user"));
addressRouter
  .route("/")
  .post(updateUserValidator, addAddress)
  .get(getAddresses);

addressRouter.route("/:addressId").delete(removeAddress).put(updateAddress);

export default addressRouter;
