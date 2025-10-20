// Routers
import categoryRouter from "./categoryRoute.js";
import subCategoryRouter from "./subCategoryRoute.js";
import brandRouter from "./brandRoute.js";
import productRouter from "./productRoute.js";
import userRouter from "./userRoute.js";
import authRouter from "./authRoute.js";
import reviewRouter from "./reviewRoute.js";
import wishlistRouter from "./whishlistRoute.js";
import addressRouter from "./addressRoute.js";
import CouponRouter from "./couponRoute.js";
import cartRouter from "./cartRoute.js";
import settingRouter from "./settingRoute.js";
import orderRouter from "./orderRoute.js";

const mountRoutes = (app) => {
  // Mount routes /attach
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", CouponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/settings", settingRouter);
  app.use("/api/v1/orders", orderRouter);
};

export {mountRoutes}
