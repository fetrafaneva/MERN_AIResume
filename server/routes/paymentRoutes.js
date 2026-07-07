import express from "express";
import protect from "../middlwares/authMiddleware.js";
import isAdmin from "../middlwares/isAdmin.js";
import {
  createPaymentRequest,
  getMyPaymentRequest,
  getPendingRequests,
  getAllRequests,
  approvePaymentRequest,
  rejectPaymentRequest,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// Côté utilisateur
paymentRouter.post("/request", protect, createPaymentRequest);
paymentRouter.get("/my-request", protect, getMyPaymentRequest);

// Côté admin
paymentRouter.get("/admin/pending", protect, isAdmin, getPendingRequests);
paymentRouter.get("/admin/all", protect, isAdmin, getAllRequests);
paymentRouter.post(
  "/admin/:id/approve",
  protect,
  isAdmin,
  approvePaymentRequest
);
paymentRouter.post("/admin/:id/reject", protect, isAdmin, rejectPaymentRequest);

export default paymentRouter;
