import { Router } from "express";
import { getSettings, updateSettings } from "../services/controllers/settingService.js";
import { allow, protect } from "../services/controllers/authService.js";

const settingRouter = Router();

settingRouter
  .route("/")
  .get(getSettings)
  .put(protect, allow('manager', 'admin'), updateSettings);

export default settingRouter;
