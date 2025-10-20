import { Router } from "express";
import {
  getSubCategories,
  createSubCategory,
  getSubCategoryById,
  deleteSubCategory,
  updateSubCategory,
} from "../services/controllers/subCategoryService.js";
import {
  subCategoryBodyValidator,
  subCategoryIdValidator,
} from "../utils/validators/subCategoryValidator.js";
import { filterObject, setIdToBody } from "../middlewares/express-middleware/nestedRouteMiddleware.js";
import { allow, protect } from "../services/controllers/authService.js";

/*
  nested routes depend usually on params instead of body, we transfer them by:
    filterObject(parentFieldName)
    setIdToBody(parentFieldName)
*/

const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .get(filterObject('category'), getSubCategories)
  .post(protect, allow('manager', 'admin'), setIdToBody('category'), subCategoryBodyValidator, createSubCategory);

subCategoryRouter
  .route("/:id")
  .get(subCategoryIdValidator, getSubCategoryById)
  .delete(protect, allow('admin'), subCategoryIdValidator, deleteSubCategory)
  .put(protect, allow('manager', 'admin'), setIdToBody('category'), subCategoryIdValidator, subCategoryBodyValidator, updateSubCategory);

export default subCategoryRouter;
