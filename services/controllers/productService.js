import productModel from "../../models/productModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
const createProduct = createOne(productModel);

// @desc    Get list of products /pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = getAll(productModel);

// @desc    Get specific product
// @route   GET api/v1/products/:id
// @access  Public
const getProductById = getOne(productModel);

// @desc    Update specific product
// @route   PUT api/v1/products/:id
// @access  Private
const updateProduct = updateOne(productModel);

// @desc    Delete specific product
// @route   DELETE api/v1/products/:id
// @access  Private
const deleteProduct = deleteOne(productModel);

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
