import reviewModel from "../../models/reviewModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

// @desc           Create review
// @nested route   POST /api/v1/products/:id/review
// @access         Private
const createReview = createOne(reviewModel);

// @desc           Get list of reviews /pagination
// @nested route   GET /api/v1/products/:id/review
// @access         Public
const getReviews = getAll(reviewModel);

// @desc          Get specific review
// @nestedroute   GET api/v1/products/:id/review/:id
// @access        Public
const getReviewById = getOne(reviewModel);

// @desc          Update specific review
// @route         PUT api/v1/products/:id/review
// @access       Private
const updateReview = updateOne(reviewModel);

// @desc         Delete specific review
// @route        DELETE api/v1/products/:id/review
// @access       Private
const deleteReview = deleteOne(reviewModel);

export {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
