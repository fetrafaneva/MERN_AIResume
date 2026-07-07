import PaymentRequest from "../models/PaymentRequest.js";
import User from "../models/User.js";
import { PREMIUM_PLANS } from "../configs/plans.js";
import { PREMIUM_PLANS, PAYMENT_NUMBERS } from "../configs/plans.js";

// ============================
// CÔTÉ UTILISATEUR
// ============================

export const getPaymentConfig = async (req, res) => {
  try {
    res.json({ plans: PREMIUM_PLANS, numbers: PAYMENT_NUMBERS });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const createPaymentRequest = async (req, res) => {
  try {
    const { plan, provider, senderPhone, transactionRef, proofImage } =
      req.body;

    if (!plan || !provider || !senderPhone) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    const planConfig = PREMIUM_PLANS[plan];
    if (!planConfig) {
      return res.status(400).json({ message: "Plan invalide" });
    }

    const existingPending = await PaymentRequest.findOne({
      user: req.userId,
      status: "pending",
    });
    if (existingPending) {
      return res.status(400).json({
        message: "Vous avez déjà une demande en attente de validation",
      });
    }

    const request = await PaymentRequest.create({
      user: req.userId,
      plan,
      amount: planConfig.amount,
      provider,
      senderPhone,
      transactionRef,
      proofImage,
    });

    res
      .status(201)
      .json({ message: "Demande envoyée, en attente de validation", request });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getMyPaymentRequest = async (req, res) => {
  try {
    const request = await PaymentRequest.findOne({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ============================
// CÔTÉ ADMIN
// ============================

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await PaymentRequest.find({ status: "pending" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await PaymentRequest.find()
      .populate("user", "name email")
      .populate("processedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const approvePaymentRequest = async (req, res) => {
  try {
    const request = await PaymentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Demande introuvable" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Demande déjà traitée" });
    }

    request.status = "approved";
    request.processedBy = req.userId;
    request.processedAt = new Date();
    await request.save();

    const user = await User.findById(request.user);
    const planConfig = PREMIUM_PLANS[request.plan];

    user.plan = "premium";
    if (planConfig.durationDays) {
      user.premiumExpiresAt = new Date(
        Date.now() + planConfig.durationDays * 24 * 60 * 60 * 1000
      );
    }
    await user.save();

    res.json({ message: "Compte basculé en Premium ✅", request });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const rejectPaymentRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await PaymentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Demande introuvable" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Demande déjà traitée" });
    }

    request.status = "rejected";
    request.adminNote = reason || null;
    request.processedBy = req.userId;
    request.processedAt = new Date();
    await request.save();

    res.json({ message: "Demande rejetée", request });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
