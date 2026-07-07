import mongoose from "mongoose";

const PaymentRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["pack5", "monthly", "yearly"],
      required: true,
    },
    amount: {
      type: Number, // en Ariary
      required: true,
    },
    provider: {
      type: String,
      enum: ["mvola", "orange", "airtel"],
      required: true,
    },
    senderPhone: {
      type: String,
      required: true,
    },
    transactionRef: {
      type: String,
      default: null,
    },
    proofImage: {
      type: String, // URL ImageKit
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: null,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const PaymentRequest = mongoose.model("PaymentRequest", PaymentRequestSchema);

export default PaymentRequest;
