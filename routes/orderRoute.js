import { Router } from "express";
import {
  checkoutWebhook,
  createCashOrder,
  createCheckoutSession,
  getOrders,
  getspecificOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../services/controllers/orderService.js";
import { allow, protect } from "../services/controllers/authService.js";
import { orderValidator } from "../utils/validators/userValidator.js";
import { filterOrder } from "../middlewares/express-middleware/nestedRouteMiddleware.js";

const orderRouter = Router();
orderRouter.use(protect);

orderRouter.post("/checkout-session", createCheckoutSession);
orderRouter.post("/", allow("user"), orderValidator, createCashOrder);

orderRouter.put("/:id/pay", allow("admin", "manager"), updateOrderToPaid);
orderRouter.put(
  "/:id/deliver",
  allow("admin", "manager"),
  updateOrderToDelivered
);

orderRouter.use(allow("user", "admin", "manager"));
orderRouter.get("/", filterOrder, getOrders);
orderRouter.get("/:id", filterOrder, getspecificOrder);

export default orderRouter;
