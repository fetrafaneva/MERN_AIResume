import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";
import { FREE_DOWNLOAD_LIMIT } from "../configs/plans.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPasword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPasword,
      isVerified: false,
    });

    return res.status(201).json({
      message:
        "Compte créé. Un administrateur doit valider votre compte avant que vous puissiez vous connecter.",
      email: newUser.email,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Votre compte est en attente de validation par un administrateur. Réessayez plus tard.",
        needsVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({ message: "Login successfully", token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const consumeDownload = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isPremiumActive()) {
      return res.json({ allowed: true, remaining: null });
    }

    if (user.extraDownloads > 0) {
      user.extraDownloads -= 1;
      await user.save();
      return res.json({
        allowed: true,
        remaining: user.extraDownloads,
        source: "pack",
      });
    }

    if (user.downloadsUsed >= FREE_DOWNLOAD_LIMIT) {
      return res.status(403).json({
        message: `Vous avez atteint votre limite de ${FREE_DOWNLOAD_LIMIT} téléchargements gratuits. Passez Premium pour continuer.`,
        limitReached: true,
      });
    }

    user.downloadsUsed += 1;
    await user.save();

    res.json({
      allowed: true,
      remaining: FREE_DOWNLOAD_LIMIT - user.downloadsUsed,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const dismissActivationNotice = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { activationNotice: null },
      { new: true }
    );
    user.password = undefined;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ============================
// ADMIN — validation des comptes
// ============================

// GET: /api/users/admin/pending
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isVerified: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST: /api/users/admin/:id/verify
export const verifyUserByAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Compte validé ✅", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE: /api/users/admin/:id/reject
export const rejectUserByAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Compte rejeté et supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
