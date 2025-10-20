import { Router } from "express";
import {
  getReviews,
  createReview,
  getReviewById,
  deleteReview,
  updateReview,
} from "../services/controllers/reviewService.js";
import {
  createReviewValidator,
  deleteReviewValidator,
  reviewIdValidator,
  updateReviewValidator,
} from "../utils/validators/reviewValidator.js";
import { filterObject, setIdToBody } from "../middlewares/express-middleware/nestedRouteMiddleware.js";
import { allow, protect } from "../services/controllers/authService.js";


const reviewRouter = Router({ mergeParams: true });

reviewRouter
  .route("/")
  .get(filterObject('product'), getReviews)
  .post(protect, allow('user'), setIdToBody('product'), createReviewValidator, createReview);

reviewRouter
  .route("/:id")
  .get(reviewIdValidator, getReviewById)
  .delete(protect, allow('user', 'manger', 'admin'), deleteReviewValidator , deleteReview)
  .put(protect, allow('user'), updateReviewValidator, updateReview);

export default reviewRouter;
