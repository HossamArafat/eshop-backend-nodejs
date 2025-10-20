import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandById,
  updateBrand,
} from "../services/controllers/brandService.js";
import {
  brandIdValidator,
  brandBodyValidator,
} from "../utils/validators/brandValidator.js";
import { storeProcessImg, uploadSingleImg } from "../middlewares/express-middleware/uploadImgMiddleware.js";
import { allow, protect } from "../services/controllers/authService.js";

const brandRouter = Router();

const setFolderName = (req, res, next) => {
  req.folderName = 'brand'
  next()
}

brandRouter
  .route("/")
  .get(getBrands)
  .post(protect, allow('manager', 'admin'), setFolderName, uploadSingleImg, brandBodyValidator, storeProcessImg, createBrand);

brandRouter
  .route("/:id")
  .get(brandIdValidator, getBrandById)
  .delete(protect, allow('admin'), brandIdValidator, deleteBrand)
  .put(protect, allow('manager', 'admin'), setFolderName, uploadSingleImg, brandIdValidator, brandBodyValidator, storeProcessImg, updateBrand);

export default brandRouter;
