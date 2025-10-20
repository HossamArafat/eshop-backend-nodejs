import categoryModel from "../../models/categoryModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
const createCategory = createOne(categoryModel);

// @desc    Get list of categories /pagination
// @route   GET /api/v1/categories
// @access  Public
const getCategories = getAll(categoryModel);

// @desc    Get specific category
// @route   GET api/v1/categories/:id
// @access  Public
const getCategoryById = getOne(categoryModel);

// @desc    Update specific category
// @route   PUT api/v1/categories/:id
// @access  Private
const updateCategory = updateOne(categoryModel);

// @desc    Delete specific category
// @route   DELETE api/v1/categories/:id
// @access  Private
const deleteCategory = deleteOne(categoryModel);

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
