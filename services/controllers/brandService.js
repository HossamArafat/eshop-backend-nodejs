import brandModel from "../../models/brandModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";



// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private
const createBrand = createOne(brandModel);

// @desc    Get list of brands /pagination
// @route   GET /api/v1/brands
// @access  Public
const getBrands = getAll(brandModel);

// @desc    Get specific brand
// @route   GET api/v1/brands/:id
// @access  Public
const getBrandById = getOne(brandModel);

// @desc    Update specific brand
// @route   PUT api/v1/brands/:id
// @access  Private
const updateBrand = updateOne(brandModel);

// @desc    Delete specific brand
// @route   DELETE api/v1/brands/:id
// @access  Private
const deleteBrand = deleteOne(brandModel);

export { createBrand, getBrands, getBrandById, updateBrand, deleteBrand };
