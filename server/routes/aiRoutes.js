import express from "express";
import protect from "../middlwares/authMiddleware.js";
import {
  enhanceProfesssionalSummary,
  enhanceJobDescription,
  UploadResume,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfesssionalSummary);
aiRouter.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, UploadResume);

export default aiRouter;
