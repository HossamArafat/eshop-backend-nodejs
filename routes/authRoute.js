import { Router } from "express";
import { login, signup, forgotPassword, verifyResetCode, resetPassword } from "../services/controllers/authService.js";
import { forgotPassValidator, loginValidator, resetPassValidator, signupValidator } from "../utils/validators/authValidator.js";

const authRouter = Router();

authRouter.post('/signup', signupValidator, signup);
authRouter.post('/login', loginValidator, login);
authRouter.post('/forgotPassword', forgotPassValidator, forgotPassword);
authRouter.post('/verifyResetCode', verifyResetCode);
authRouter.post('/resetPassword', resetPassValidator, resetPassword);

export default authRouter;
