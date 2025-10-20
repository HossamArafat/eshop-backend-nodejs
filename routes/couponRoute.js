import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
} from "../services/controllers/CouponService.js";
import { allow, protect } from "../services/controllers/authService.js";

const CouponRouter = Router();

CouponRouter.use(protect, allow("manager", "admin"));

CouponRouter.route("/").get(getCoupons).post(createCoupon);
CouponRouter.route("/:id")
  .get(getCouponById)
  .delete(deleteCoupon)
  .put(updateCoupon);

export default CouponRouter;
