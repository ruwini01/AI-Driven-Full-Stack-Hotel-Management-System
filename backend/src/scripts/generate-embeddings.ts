import Hotel from "../infrastructure/entities/Hotel";
import { generateEmbedding } from "../application/utils/embeddings";
import mongoose from "mongoose";

async function generateEmbeddingsForAllHotels() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    
    console.log("Connected to MongoDB");
    
    const hotels = await Hotel.find();
    console.log(`Found ${hotels.length} hotels`);
    
    for (const hotel of hotels) {
      if (!hotel.embedding || hotel.embedding.length === 0) {
        console.log(`Generating embedding for: ${hotel.name}`);
        
        const embedding = await generateEmbedding(
          `${hotel.name} ${hotel.description} ${hotel.location} ${hotel.price}`
        );
        
        await Hotel.findByIdAndUpdate(hotel._id, { embedding });
        console.log(`✅ Updated ${hotel.name}`);
      } else {
        console.log(`⏭️  Skipping ${hotel.name} (already has embedding)`);
      }
    }
    
    console.log("✅ All embeddings generated!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

generateEmbeddingsForAllHotels();