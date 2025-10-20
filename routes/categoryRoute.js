import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../services/controllers/categoryService.js";
import {
  categoryIdValidator,
  categoryBodyValidator,
} from "../utils/validators/categoryValidator.js";
import subCategoryRouter from "./subCategoryRoute.js";
import { storeProcessImg, uploadSingleImg } from "../middlewares/express-middleware/uploadImgMiddleware.js";
import { allow, protect } from "../services/controllers/authService.js";

const setFolderName = (req, res, next) => {
  req.folderName = 'category'
  next()
}

const categoryRouter = Router();
// Nested routes
categoryRouter.use('/:parentId/subcategories', categoryIdValidator,  subCategoryRouter)

// Normal routes
categoryRouter
  .route("/")
  .get(getCategories)
  .post(protect, allow('manager', 'admin'), setFolderName, uploadSingleImg, categoryBodyValidator, storeProcessImg, createCategory);

categoryRouter
  .route("/:id")
  .get(categoryIdValidator, getCategoryById)
  .delete(protect, allow('admin'), categoryIdValidator, deleteCategory)
  .put(protect, allow('manager', 'admin'), setFolderName, uploadSingleImg, categoryIdValidator, categoryBodyValidator, storeProcessImg, updateCategory);

export default categoryRouter;
