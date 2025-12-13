"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = void 0;
const openai_1 = require("openai");
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const generateEmbedding = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        dimensions: 1536,
        input: text,
    });
    return response.data[0].embedding;
};
exports.generateEmbedding = generateEmbedding;
//# sourceMappingURL=embeddings.js.map