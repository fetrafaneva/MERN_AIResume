// testOpenAI.js
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const testAI = async () => {
  try {
    const response = await client.chat.completions.create({
      model: "c",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Enhance professional summaries.",
        },
        {
          role: "user",
          content: "Write a short professional summary for a MERN developer",
        },
      ],
    });

    console.log("Réponse AI :", response.choices[0].message.content);
  } catch (err) {
    console.error("Erreur AI :", err);
  }
};

testAI();
