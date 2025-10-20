import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../services/controllers/productService.js";
import {
  productIdValidator,
  productBodyValidator,
} from "../utils/validators/productValidator.js";
import { storeProcessMixImg, uploadMixImg } from "../middlewares/express-middleware/uploadImgMiddleware.js";
import { allow, protect } from "../services/controllers/authService.js";
import reviewRouter from "./reviewRoute.js";

const setFolderName = (req, res, next) => {
  req.folderName = 'product'
  next()
}

const productRouter = Router();
// Nested routes
productRouter.use('/:parentId/reviews', reviewRouter)

// Normal routes
productRouter
  .route("/")
  .get(getProducts)
  .post(protect, allow('manager', 'admin'), setFolderName, uploadMixImg , productBodyValidator, storeProcessMixImg, createProduct);

productRouter
  .route("/:id")
  .get(productIdValidator, getProductById)
  .delete(protect, allow('admin'), productIdValidator, deleteProduct)
  .put(protect, allow('manager', 'admin'), setFolderName, uploadMixImg, productIdValidator, productBodyValidator, storeProcessMixImg, updateProduct);

export default productRouter;
