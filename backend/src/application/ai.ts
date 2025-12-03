import { Request, Response, NextFunction } from "express";
import { OpenAI } from "openai";
import Hotel from "../infrastructure/entities/Hotel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const respondToAIQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.body;

    const hotelsData = await Hotel.find();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fixed: use a valid model
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that helps users choose a hotel based on the vibe they describe. Available hotels: ${JSON.stringify(
            hotelsData
          )}. Recommend a hotel with its information.`
        },
        {
          role: "user",
          content: query
        }
      ],
    });

    const aiResponse = response.choices[0]?.message?.content || "No response";

    res.status(200).json({
      response: aiResponse,
    });
  } catch (error) {
    next(error);
  }
};