"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondToAIQuery = void 0;
const openai_1 = require("openai");
const Hotel_1 = __importDefault(require("../infrastructure/entities/Hotel"));
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const respondToAIQuery = async (req, res, next) => {
    try {
        const { query } = req.body;
        const hotelsData = await Hotel_1.default.find();
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Fixed: use a valid model
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that helps users choose a hotel based on the vibe they describe. Available hotels: ${JSON.stringify(hotelsData)}. Recommend a hotel with its information.`
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
    }
    catch (error) {
        next(error);
    }
};
exports.respondToAIQuery = respondToAIQuery;
//# sourceMappingURL=ai.js.map