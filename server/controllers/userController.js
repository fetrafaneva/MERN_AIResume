import User from "../configs/models/User.js";
import bcrypt from "bcrypt";

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    const {} = req.body;

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
  } catch (error) {}
};
