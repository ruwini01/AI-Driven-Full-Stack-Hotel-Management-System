import "dotenv/config";
import connectDB from "./infrastructure/db";

import Hotel from "./infrastructure/entities/Hotel";
import Location from "./infrastructure/entities/Location";

// Sample hotels data (without _id and reviews - will be auto-generated)
const hotels = [
  {
    name: "Ocean Paradise Resort",
    location: "Maldives",
    city: "Male",
    rating: 4.9,
    reviews: 1243,
    price: 450,
    stars: 5,
    featured: true,
    description: "Experience luxury like never before at Ocean Paradise Resort, where crystal-clear waters meet pristine white beaches. Our overwater villas offer unparalleled views and world-class amenities.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Beach Access", "Room Service"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1"
    ],
    roomTypes: [
      { name: "Overwater Villa", price: 450, available: 5 },
      { name: "Beach Villa", price: 350, available: 8 },
      { name: "Garden Suite", price: 250, available: 12 }
    ]
  },
  {
    name: "Mountain Peak Lodge",
    location: "Swiss Alps",
    city: "Zermatt",
    rating: 4.8,
    reviews: 892,
    price: 380,
    stars: 5,
    featured: true,
    description: "Nestled in the heart of the Swiss Alps, Mountain Peak Lodge offers breathtaking mountain views and cozy alpine charm. Perfect for winter sports enthusiasts and nature lovers.",
    amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Gym", "Ski Storage", "Fireplace"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1"
    ],
    roomTypes: [
      { name: "Alpine Suite", price: 380, available: 6 },
      { name: "Mountain View Room", price: 280, available: 10 },
      { name: "Cozy Chalet", price: 480, available: 3 }
    ]
  },
  {
    name: "Urban Skyline Hotel",
    location: "New York, USA",
    city: "Manhattan",
    rating: 4.7,
    reviews: 2156,
    price: 320,
    stars: 4,
    featured: false,
    description: "Located in the heart of Manhattan, Urban Skyline Hotel offers stunning city views and modern luxury. Steps away from Times Square and Central Park.",
    amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Gym", "Business Center", "Concierge"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1"
    ],
    roomTypes: [
      { name: "Skyline Suite", price: 420, available: 4 },
      { name: "Deluxe Room", price: 320, available: 15 },
      { name: "Executive Suite", price: 520, available: 2 }
    ]
  },
  {
    name: "Tropical Garden Resort",
    location: "Bali, Indonesia",
    city: "Ubud",
    rating: 4.9,
    reviews: 1567,
    price: 280,
    stars: 5,
    featured: true,
    description: "Immerse yourself in Balinese culture at Tropical Garden Resort. Surrounded by lush rice terraces and tropical gardens, this peaceful retreat offers ultimate relaxation.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Yoga Studio", "Cultural Activities"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1"
    ],
    roomTypes: [
      { name: "Villa with Pool", price: 380, available: 7 },
      { name: "Garden View Room", price: 280, available: 12 },
      { name: "Luxury Suite", price: 480, available: 4 }
    ]
  },
  {
    name: "Desert Oasis Hotel",
    location: "Dubai, UAE",
    city: "Dubai",
    rating: 4.8,
    reviews: 1834,
    price: 420,
    stars: 5,
    featured: false,
    description: "Experience Arabian luxury in the heart of Dubai. Our Desert Oasis Hotel combines traditional hospitality with modern elegance.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Desert Safari", "Private Beach"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1"
    ],
    roomTypes: [
      { name: "Royal Suite", price: 620, available: 2 },
      { name: "Premium Room", price: 420, available: 10 },
      { name: "Deluxe Room", price: 320, available: 15 }
    ]
  },
  {
    name: "Coastal Breeze Inn",
    location: "California, USA",
    city: "Santa Monica",
    rating: 4.6,
    reviews: 987,
    price: 220,
    stars: 4,
    featured: false,
    description: "Charming beachfront inn offering comfortable rooms and easy access to Santa Monica Pier and Venice Beach. Perfect for a California coastal getaway.",
    amenities: ["WiFi", "Beach Access", "Restaurant", "Bike Rental", "Parking"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1"
    ],
    roomTypes: [
      { name: "Ocean View Room", price: 280, available: 8 },
      { name: "Standard Room", price: 220, available: 12 },
      { name: "Suite", price: 380, available: 5 }
    ]
  },
  {
    name: "Historic Castle Hotel",
    location: "Scotland, UK",
    city: "Edinburgh",
    rating: 4.7,
    reviews: 745,
    price: 350,
    stars: 5,
    featured: false,
    description: "Stay in a real Scottish castle with centuries of history. Elegant rooms, fine dining, and stunning Highland views await.",
    amenities: ["WiFi", "Restaurant", "Bar", "Library", "Gardens", "Historic Tours"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1"
    ],
    roomTypes: [
      { name: "Tower Suite", price: 450, available: 3 },
      { name: "Castle Room", price: 350, available: 8 },
      { name: "Garden View", price: 280, available: 10 }
    ]
  },
  {
    name: "Zen Garden Retreat",
    location: "Kyoto, Japan",
    city: "Kyoto",
    rating: 4.9,
    reviews: 1123,
    price: 310,
    stars: 5,
    featured: true,
    description: "Traditional Japanese ryokan featuring tatami rooms, onsen baths, and authentic kaiseki cuisine. A peaceful escape in historic Kyoto.",
    amenities: ["WiFi", "Onsen", "Restaurant", "Tea Ceremony", "Garden", "Meditation Room"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1"
    ],
    roomTypes: [
      { name: "Ryokan Suite", price: 410, available: 6 },
      { name: "Traditional Room", price: 310, available: 10 },
      { name: "Garden Suite", price: 510, available: 3 }
    ]
  },
  {
    name: "Montmartre Majesty Hotel",
    location: "Paris, France",
    city: "Paris",
    rating: 4.7,
    reviews: 856,
    price: 290,
    stars: 4,
    featured: false,
    description: "Experience the charm of Montmartre with this luxurious hotel. Enjoy stunning views of the city and the Eiffel Tower from your room.",
    amenities: ["WiFi", "Restaurant", "Bar", "Concierge", "Room Service"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1"
    ],
    roomTypes: [
      { name: "Eiffel View Suite", price: 390, available: 4 },
      { name: "Deluxe Room", price: 290, available: 12 },
      { name: "Standard Room", price: 190, available: 15 }
    ]
  },
  {
    name: "Sydney Harbor Hotel",
    location: "Sydney, Australia",
    city: "Sydney",
    rating: 4.8,
    reviews: 1432,
    price: 300,
    stars: 5,
    featured: true,
    description: "Experience the beauty of Sydney with this luxurious hotel. Enjoy stunning views of the city and the Sydney Harbor from your room.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Harbor Cruises"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1"
    ],
    roomTypes: [
      { name: "Harbor View Suite", price: 450, available: 5 },
      { name: "Premium Room", price: 300, available: 10 },
      { name: "City View Room", price: 220, available: 12 }
    ]
  },
  {
    name: "Amazon Rainforest Lodge",
    location: "Amazon, Brazil",
    city: "Manaus",
    rating: 4.6,
    reviews: 634,
    price: 240,
    stars: 4,
    featured: false,
    description: "Eco-luxury lodge in the heart of the Amazon rainforest. Experience wildlife, indigenous culture, and pristine nature.",
    amenities: ["WiFi", "Restaurant", "Guided Tours", "Canoe Rental", "Bird Watching"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1"
    ],
    roomTypes: [
      { name: "Jungle Suite", price: 320, available: 6 },
      { name: "Canopy Room", price: 240, available: 10 },
      { name: "Standard Bungalow", price: 180, available: 8 }
    ]
  },
  {
    name: "Santorini Sunset Villa",
    location: "Santorini, Greece",
    city: "Oia",
    rating: 4.9,
    reviews: 1876,
    price: 380,
    stars: 5,
    featured: true,
    description: "Iconic white-washed villa overlooking the caldera. Watch breathtaking sunsets from your private terrace with infinity pool.",
    amenities: ["WiFi", "Pool", "Restaurant", "Spa", "Wine Tasting", "Concierge"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1"
    ],
    roomTypes: [
      { name: "Caldera View Villa", price: 480, available: 4 },
      { name: "Sunset Suite", price: 380, available: 7 },
      { name: "Garden Room", price: 280, available: 9 }
    ]
  },
  {
    name: "Marrakech Riad Palace",
    location: "Marrakech, Morocco",
    city: "Marrakech",
    rating: 4.7,
    reviews: 923,
    price: 260,
    stars: 4,
    featured: false,
    description: "Traditional Moroccan riad in the heart of the medina. Featuring intricate tilework, tranquil courtyards, and rooftop terrace.",
    amenities: ["WiFi", "Pool", "Restaurant", "Spa", "Hammam", "Cooking Classes"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1"
    ],
    roomTypes: [
      { name: "Royal Suite", price: 360, available: 3 },
      { name: "Deluxe Room", price: 260, available: 8 },
      { name: "Standard Room", price: 180, available: 12 }
    ]
  },
  {
    name: "Iceland Northern Lights Hotel",
    location: "Reykjavik, Iceland",
    city: "Reykjavik",
    rating: 4.8,
    reviews: 1245,
    price: 340,
    stars: 5,
    featured: true,
    description: "Modern hotel with glass-roofed suites perfect for Northern Lights viewing. Geothermal spa and Icelandic cuisine.",
    amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Aurora Wake-up Service", "Hot Tubs"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1"
    ],
    roomTypes: [
      { name: "Aurora Suite", price: 440, available: 5 },
      { name: "Premium Room", price: 340, available: 10 },
      { name: "Standard Room", price: 240, available: 14 }
    ]
  },
  {
    name: "Cape Town Oceanfront Resort",
    location: "Cape Town, South Africa",
    city: "Cape Town",
    rating: 4.7,
    reviews: 1087,
    price: 270,
    stars: 4,
    featured: false,
    description: "Stunning resort at the foot of Table Mountain with ocean views. Close to beaches, vineyards, and wildlife reserves.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Safari Tours"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1"
    ],
    roomTypes: [
      { name: "Ocean View Suite", price: 370, available: 6 },
      { name: "Mountain View Room", price: 270, available: 11 },
      { name: "Garden Room", price: 200, available: 13 }
    ]
  },
  {
    name: "Bangkok Riverside Hotel",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    rating: 4.6,
    reviews: 1534,
    price: 180,
    stars: 4,
    featured: false,
    description: "Luxury hotel along the Chao Phraya River. Traditional Thai hospitality with modern amenities and rooftop bar.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "River Shuttle", "Thai Massage"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1"
    ],
    roomTypes: [
      { name: "River View Suite", price: 280, available: 8 },
      { name: "Deluxe Room", price: 180, available: 15 },
      { name: "Superior Room", price: 130, available: 20 }
    ]
  },
  {
    name: "Venice Canal Palace",
    location: "Venice, Italy",
    city: "Venice",
    rating: 4.8,
    reviews: 967,
    price: 360,
    stars: 5,
    featured: true,
    description: "Historic palazzo overlooking the Grand Canal. Venetian elegance, gondola service, and Michelin-starred dining.",
    amenities: ["WiFi", "Restaurant", "Bar", "Concierge", "Gondola Service", "Private Dock"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1"
    ],
    roomTypes: [
      { name: "Canal View Suite", price: 460, available: 4 },
      { name: "Premium Room", price: 360, available: 8 },
      { name: "Classic Room", price: 280, available: 10 }
    ]
  },
  {
    name: "Singapore Sky Hotel",
    location: "Singapore",
    city: "Singapore",
    rating: 4.7,
    reviews: 1698,
    price: 290,
    stars: 5,
    featured: false,
    description: "Ultra-modern hotel in Marina Bay with rooftop infinity pool. Stunning city skyline views and world-class dining.",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Business Center"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1"
    ],
    roomTypes: [
      { name: "Sky Suite", price: 390, available: 6 },
      { name: "Deluxe Room", price: 290, available: 14 },
      { name: "Superior Room", price: 220, available: 18 }
    ]
  },
  {
    name: "Patagonia Wilderness Lodge",
    location: "Patagonia, Chile",
    city: "Torres del Paine",
    rating: 4.9,
    reviews: 542,
    price: 320,
    stars: 4,
    featured: true,
    description: "Remote luxury lodge in Torres del Paine National Park. Unparalleled access to glaciers, mountains, and wildlife.",
    amenities: ["WiFi", "Restaurant", "Bar", "Guided Hikes", "Wildlife Tours", "Fireplace"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1"
    ],
    roomTypes: [
      { name: "Mountain Suite", price: 420, available: 4 },
      { name: "Deluxe Room", price: 320, available: 8 },
      { name: "Standard Room", price: 250, available: 10 }
    ]
  },
  {
    name: "Vienna Imperial Hotel",
    location: "Vienna, Austria",
    city: "Vienna",
    rating: 4.8,
    reviews: 1234,
    price: 310,
    stars: 5,
    featured: false,
    description: "Grand hotel in the heart of Vienna's historic center. Imperial elegance, classical concerts, and Viennese coffee culture.",
    amenities: ["WiFi", "Restaurant", "Bar", "Spa", "Concert Hall", "Concierge"],
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1"
    ],
    roomTypes: [
      { name: "Imperial Suite", price: 510, available: 3 },
      { name: "Deluxe Room", price: 310, available: 12 },
      { name: "Classic Room", price: 230, available: 15 }
    ]
  }
];
// Sample reviews data
const reviews = [
  {
    rating: 5,
    comment:
      "Absolutely amazing hotel! The views are breathtaking and the service is impeccable.",
  },
  {
    rating: 4,
    comment:
      "Great location and comfortable rooms. Would definitely recommend!",
  },
  {
    rating: 5,
    comment:
      "Perfect stay! The amenities are top-notch and the staff is very friendly.",
  },
  {
    rating: 4,
    comment:
      "Beautiful hotel with excellent facilities. The breakfast was delicious.",
  },
  {
    rating: 5,
    comment:
      "Outstanding experience! The room was spacious and the view was spectacular.",
  },
  {
    rating: 4,
    comment: "Very nice hotel with good service. The location is convenient.",
  },
  {
    rating: 5,
    comment: "Exceptional hotel! Everything exceeded our expectations.",
  },
  {
    rating: 4,
    comment: "Lovely stay! The hotel is clean and the staff is helpful.",
  },
];

// Sample locations data (extracted from hotel locations)
const locations = [
  { name: "France" },
  { name: "Australia" },
  { name: "Japan" },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data

    await Hotel.deleteMany({});
    await Location.deleteMany({});

    console.log("Cleared existing data");

    // Insert locations
    const createdLocations = await Location.insertMany(locations);
    console.log(`Created ${createdLocations.length} locations`);

    // Insert hotels
    const createdHotels = await Hotel.insertMany(hotels);
    console.log(`Created ${createdHotels.length} hotels`);

    console.log("Updated hotels with review references");
    console.log("Database seeded successfully!");

    // Display summary
    console.log("\n=== SEED SUMMARY ===");
    console.log(`Locations: ${createdLocations.length}`);
    console.log(`Hotels: ${createdHotels.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed script
seedDatabase();