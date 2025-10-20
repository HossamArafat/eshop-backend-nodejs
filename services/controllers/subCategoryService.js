import subCategoryModel from "../../models/subCategoryModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";


// @desc           Create subCategory
// @route          POST /api/v1/subcategories
// @nested route   POST /api/v1/categories/:id/subcategories
// @access         Private
const createSubCategory = createOne(subCategoryModel);

// @desc           Get list of subCategories /pagination
// @route          GET /api/v1/subcategories
// @nested route   GET /api/v1/categories/:id/subcategories
// @access         Public
const getSubCategories = getAll(subCategoryModel);
// @desc    Get specific subCategory
// @route   GET api/v1/subcategories/:id
// @access  Public
const getSubCategoryById = getOne(subCategoryModel);

// @desc    Update specific category
// @route   PUT api/v1/categories/:id
// @access  Private
const updateSubCategory = updateOne(subCategoryModel);

// @desc    Delete specific subCategory
// @route   DELETE api/v1/subcategories/:id
// @access  Private
const deleteSubCategory = deleteOne(subCategoryModel);

export {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
