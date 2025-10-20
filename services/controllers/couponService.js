import couponModel from "../../models/couponModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";



// @desc    Create coupon
// @route   POST /api/v1/coupons
// @access  Private
const createCoupon = createOne(couponModel);

// @desc    Get list of coupons /pagination
// @route   GET /api/v1/coupons
// @access  Public
const getCoupons = getAll(couponModel);

// @desc    Get specific coupon
// @route   GET api/v1/coupons/:id
// @access  Public
const getCouponById = getOne(couponModel);

// @desc    Update specific coupon
// @route   PUT api/v1/coupons/:id
// @access  Private
const updateCoupon = updateOne(couponModel);

// @desc    Delete specific coupon
// @route   DELETE api/v1/coupons/:id
// @access  Private
const deleteCoupon = deleteOne(couponModel);

export { createCoupon, getCoupons, getCouponById, updateCoupon, deleteCoupon };
