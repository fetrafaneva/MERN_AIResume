import Resume from "../models/Resume.js";

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    // create new resume
    const newResume = await Resume.create({ userId, title });
    // return success message
    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
