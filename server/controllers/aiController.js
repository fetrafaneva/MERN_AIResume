// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum

export const enhanceProfesssionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required field" });
    }

    await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career oblectives. Make it compelling and ATS-friendly. and only return text no options or anything else",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
  } catch (error) {}
};
