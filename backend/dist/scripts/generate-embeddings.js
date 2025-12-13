"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hotel_1 = __importDefault(require("../infrastructure/entities/Hotel"));
const embeddings_1 = require("../application/utils/embeddings");
const mongoose_1 = __importDefault(require("mongoose"));
async function generateEmbeddingsForAllHotels() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        const hotels = await Hotel_1.default.find();
        console.log(`Found ${hotels.length} hotels`);
        for (const hotel of hotels) {
            if (!hotel.embedding || hotel.embedding.length === 0) {
                console.log(`Generating embedding for: ${hotel.name}`);
                const embedding = await (0, embeddings_1.generateEmbedding)(`${hotel.name} ${hotel.description} ${hotel.location} ${hotel.price}`);
                await Hotel_1.default.findByIdAndUpdate(hotel._id, { embedding });
                console.log(`✅ Updated ${hotel.name}`);
            }
            else {
                console.log(`⏭️  Skipping ${hotel.name} (already has embedding)`);
            }
        }
        console.log("✅ All embeddings generated!");
        process.exit(0);
    }
    catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
generateEmbeddingsForAllHotels();
//# sourceMappingURL=generate-embeddings.js.map