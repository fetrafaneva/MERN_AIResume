import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserShema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // --- Système Premium / rôles ---
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    premiumExpiresAt: {
      type: Date,
      default: null,
    },
    extraDownloads: {
      type: Number,
      default: 0,
    },
    extraCredits: {
      type: Number,
      default: 0,
    },
    downloadsUsed: {
      type: Number,
      default: 0,
    },

    // --- Suivi des générations gratuites ---
    generationsUsed: {
      type: Number,
      default: 0,
    },
    generationsResetAt: {
      type: Date,
      default: () => new Date(), // sera recalculé au premier usage
    },
  },
  { timestamps: true }
);

UserShema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Vérifie si l'utilisateur a un accès premium valide (et pas expiré)
UserShema.methods.isPremiumActive = function () {
  if (this.plan !== "premium") return false;
  if (!this.premiumExpiresAt) return true; // premium "à vie" ou pack ponctuel géré ailleurs
  return this.premiumExpiresAt > new Date();
};

const User = mongoose.model("User", UserShema);

export default User;
