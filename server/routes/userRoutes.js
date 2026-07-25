import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
  verifyOtp,
  resendOtp,
  consumeDownload,
  dismissActivationNotice,
} from "../controllers/userController.js";
import protect from "../middlwares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);
userRouter.post("/consume-download", protect, consumeDownload);
userRouter.post("/dismiss-activation-notice", protect, dismissActivationNotice);

export default userRouter;
