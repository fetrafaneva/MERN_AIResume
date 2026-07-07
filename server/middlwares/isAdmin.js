import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export default isAdmin;
