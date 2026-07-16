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

    // verifier si les champs obligatoire sont remplies
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // verifier si l'utilisateur existe déja
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // creer nouveau utilisateur
    const hashedPasword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPasword,
    });

    // return success message
    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // verifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check if password is correct
    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // return success message
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

    // check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // return user
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

    // return user resumes
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

    // Premium actif → téléchargements illimités
    if (user.isPremiumActive()) {
      return res.json({ allowed: true, remaining: null });
    }

    // Crédits ponctuels (pack) disponibles → on les consomme en priorité
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
