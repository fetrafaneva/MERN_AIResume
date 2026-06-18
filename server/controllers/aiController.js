import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Resume from "../models/Resume.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});
// Enhance Professional Summary
export const enhanceProfesssionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const result = await model.generateContent(`
      Enhance this professional summary for a resume. 
      Make it compelling, ATS-friendly, 1-2 sentences max. 
      Highlight key skills and career objectives.
      Only return the enhanced text, nothing else.

      Content: ${userContent}
    `);

    const enhancedContent = result.response.text();
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Enhance Job Description
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const result = await model.generateContent(`
      Enhance this job description for a resume. 
      Use strong action verbs, quantifiable achievements if possible.
      Make it ATS-friendly, 3-5 bullet points style or concise paragraph.
      Only return the enhanced text.

      Content: ${userContent}
    `);

    const enhancedContent = result.response.text();
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Upload & Parse Resume
export const UploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const result = await model.generateContent(`
      Extract structured data from this resume and return ONLY valid JSON (no extra text).

      Resume text: ${resumeText}
    `);

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    const newResume = await Resume.create({
      userId,
      title: title || "Mon CV",
      ...parsedData,
    });

    res.json({
      resumeId: newResume._id,
      message: "Resume created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
