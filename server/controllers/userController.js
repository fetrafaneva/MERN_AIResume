import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";
import { FREE_DOWNLOAD_LIMIT } from "../configs/plans.js";
import { transporter } from "../configs/mailer.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, name, otp) => {
  await transporter.sendMail({
    from: `"AIResume" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Votre code de vérification AIResume",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #16a34a;">Bonjour ${name},</h2>
        <p>Voici votre code de vérification pour activer votre compte AIResume :</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #15803d; text-align: center; padding: 16px; background: #f0fdf4; border-radius: 8px;">
          ${otp}
        </p>
        <p style="color: #64748b; font-size: 13px;">
          Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
        </p>
      </div>
    `,
  });
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
    const otp = generateOtp();

    const newUser = await User.create({
      name,
      email,
      password: hashedPasword,
      isVerified: false,
      otpCode: otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    try {
      await sendOtpEmail(email, name, otp);
    } catch (emailError) {
      console.log("Erreur envoi email OTP:", emailError.message);
      // On ne bloque pas l'inscription si l'email échoue, mais on prévient le front
      return res.status(201).json({
        message:
          "Compte créé, mais l'email de vérification n'a pas pu être envoyé. Réessayez.",
        email: newUser.email,
        emailFailed: true,
      });
    }

    return res.status(201).json({
      message:
        "Compte créé. Vérifiez votre email pour le code de confirmation.",
      email: newUser.email,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for OTP verification
// POST: /api/users/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email et code requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Ce compte est déjà vérifié" });
    }

    if (!user.otpCode || user.otpCode !== otp) {
      return res.status(400).json({ message: "Code incorrect" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        message: "Ce code a expiré. Demandez-en un nouveau.",
        expired: true,
      });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      message: "Compte vérifié avec succès",
      token,
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller to resend OTP
// POST: /api/users/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Ce compte est déjà vérifié" });
    }

    const otp = generateOtp();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, user.name, otp);

    return res.status(200).json({ message: "Nouveau code envoyé" });
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
        message: "Veuillez vérifier votre email avant de vous connecter",
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
