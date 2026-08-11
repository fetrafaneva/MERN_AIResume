import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
  consumeDownload,
  dismissActivationNotice,
  getPendingUsers,
  verifyUserByAdmin,
  rejectUserByAdmin,
} from "../controllers/userController.js";
import protect from "../middlwares/authMiddleware.js";
import isAdmin from "../middlwares/isAdmin.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);
userRouter.post("/consume-download", protect, consumeDownload);
userRouter.post("/dismiss-activation-notice", protect, dismissActivationNotice);

// Admin
userRouter.get("/admin/pending", protect, isAdmin, getPendingUsers);
userRouter.post("/admin/:id/verify", protect, isAdmin, verifyUserByAdmin);
userRouter.delete("/admin/:id/reject", protect, isAdmin, rejectUserByAdmin);

export default userRouter;
