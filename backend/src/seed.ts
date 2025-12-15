import "dotenv/config";
import connectDB from "./infrastructure/db";

import Hotel from "./infrastructure/entities/Hotel";
import Location from "./infrastructure/entities/Location";
import Booking from "./infrastructure/entities/Booking";
import { generateEmbedding } from "./application/utils/embeddings";
import stripe from "./infrastructure/stripe";
import { log } from "console";

// Sample hotels data with detailed descriptions
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
    description: "Experience luxury like never before at Ocean Paradise Resort, where crystal-clear turquoise waters meet pristine white sandy beaches. Our exclusive overwater villas offer unparalleled panoramic views of the Indian Ocean and world-class amenities including private infinity pools, glass floor panels for marine life viewing, and personalized butler service. Indulge in our award-winning spa, savor exquisite international cuisine at our signature restaurants, and create unforgettable memories in this tropical paradise.",
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
    description: "Nestled in the heart of the majestic Swiss Alps with breathtaking views of the iconic Matterhorn, Mountain Peak Lodge offers the perfect blend of cozy alpine charm and modern luxury. Our lodge features traditional wooden architecture, crackling fireplaces, and floor-to-ceiling windows that frame spectacular mountain vistas. Perfect for winter sports enthusiasts with ski-in/ski-out access, as well as nature lovers seeking summer hiking adventures. Unwind in our geothermal spa after a day on the slopes.",
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
    description: "Located in the vibrant heart of Manhattan, Urban Skyline Hotel offers stunning panoramic city views and contemporary luxury accommodation. Just steps away from iconic landmarks including Times Square, Central Park, and Broadway theaters, our hotel perfectly positions you to explore the city that never sleeps. Featuring sleek modern design, rooftop bar with 360-degree skyline views, state-of-the-art fitness center, and award-winning dining. Experience the pulse of New York City while enjoying world-class hospitality and comfort.",
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
    description: "Immerse yourself in authentic Balinese culture and tranquility at Tropical Garden Resort, surrounded by lush emerald rice terraces and exotic tropical gardens. This peaceful sanctuary offers the ultimate relaxation experience with traditional Balinese architecture, open-air pavilions, and private infinity pools overlooking verdant valleys. Participate in daily yoga sessions, traditional cooking classes, and temple ceremonies. Our holistic spa features ancient Balinese healing treatments, while our organic restaurant serves farm-to-table cuisine using ingredients from our gardens.",
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
    description: "Experience unparalleled Arabian luxury and hospitality in the glittering heart of Dubai at Desert Oasis Hotel. Our magnificent property seamlessly combines traditional Middle Eastern elegance with cutting-edge modern design and technology. Enjoy exclusive access to our private beach, championship golf course, and world-renowned spa featuring authentic hammam treatments. Savor exquisite international and Arabic cuisine at our multiple award-winning restaurants. Embark on unforgettable desert safaris, dune bashing adventures, and witness spectacular Bedouin cultural performances under the stars.",
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
    description: "Discover the quintessential California beach experience at Coastal Breeze Inn, a charming beachfront property offering comfortable, sun-soaked rooms with direct access to golden sandy beaches. Located perfectly between the iconic Santa Monica Pier and trendy Venice Beach boardwalk, our inn provides an authentic Southern California coastal lifestyle. Wake up to ocean breezes, enjoy morning beach yoga, rent bikes to explore the scenic coastline, and watch stunning Pacific sunsets from your private balcony. Ideal for families, couples, and solo travelers.",
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
    description: "Step back in time and experience royal Scottish heritage at Historic Castle Hotel, an authentic medieval castle with centuries of fascinating history. Set amidst rolling Highland hills with commanding views of dramatic landscapes, our castle features elegant period rooms with antique furnishings, grand banquet halls, and atmospheric stone corridors. Enjoy fine Scottish cuisine featuring locally sourced game and seafood, explore our extensive gardens and grounds, participate in guided historical tours, and perhaps encounter one of our resident friendly ghosts during your unforgettable stay.",
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
    description: "Experience authentic Japanese hospitality and tranquility at Zen Garden Retreat, a traditional ryokan featuring elegant tatami mat rooms, soothing natural hot spring onsen baths, and exquisite multi-course kaiseki cuisine prepared with seasonal ingredients. Located in historic Kyoto near ancient temples and bamboo groves, our ryokan offers a peaceful escape from modern life. Participate in traditional tea ceremonies, meditation sessions in our zen garden, and kimono dressing experiences. Sleep on comfortable futon bedding and wake to the gentle sounds of nature.",
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
    description: "Experience the romantic charm and artistic soul of Paris at Montmartre Majesty Hotel, perfectly situated in the bohemian hilltop neighborhood of Montmartre. Enjoy breathtaking views of the Eiffel Tower and Sacré-Cœur Basilica from our rooftop terrace while sipping fine French wine. Our elegantly appointed rooms blend classic Parisian style with modern comfort. Stroll cobblestone streets lined with artist studios, explore nearby museums, indulge in authentic French pastries and cuisine, and immerse yourself in the vibrant culture that inspired countless legendary artists throughout history.",
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
    description: "Experience the stunning beauty and vibrant energy of Australia's most iconic city at Sydney Harbor Hotel, offering spectacular views of the world-famous Sydney Opera House and Harbor Bridge. Our luxurious waterfront property features contemporary Australian design, infinity pools overlooking the sparkling harbor, and award-winning restaurants showcasing fresh local seafood and premium Australian wines. Explore nearby Circular Quay, the historic Rocks district, and pristine harbor beaches. Join exclusive harbor cruises, enjoy rooftop cocktails at sunset, and experience unforgettable Sydney hospitality.",
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
    description: "Embark on an extraordinary eco-adventure at Amazon Rainforest Lodge, an environmentally conscious luxury retreat deep in the heart of the world's most biodiverse ecosystem. Our sustainable lodge offers comfortable accommodations built from local materials, surrounded by pristine jungle teeming with exotic wildlife. Experience guided jungle treks with expert naturalists, canoe expeditions through winding waterways, wildlife spotting including monkeys and colorful birds, and authentic encounters with indigenous communities. Fall asleep to the symphony of rainforest sounds in this once-in-a-lifetime nature immersion experience.",
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
    description: "Experience the iconic beauty of the Greek Islands at Santorini Sunset Villa, featuring stunning whitewashed cave houses perched dramatically on volcanic cliffs overlooking the deep blue Aegean Sea and legendary caldera. Each villa boasts private terraces with infinity pools perfect for watching the world's most spectacular sunsets. Enjoy traditional Greek hospitality, savor fresh Mediterranean cuisine at cliffside restaurants, explore charming blue-domed churches, and swim in crystal-clear waters. Visit ancient ruins, sample world-class local wines, and create romantic memories in this picture-perfect paradise destination.",
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
    description: "Discover the exotic magic of Morocco at Marrakech Riad Palace, a beautifully restored traditional riad hidden in the heart of the ancient medina. Behind ornate wooden doors lies a tranquil oasis featuring intricate colorful tilework, carved cedar ceilings, bubbling fountains, and lush interior courtyards. Relax on the rooftop terrace with panoramic views of the city and Atlas Mountains. Experience authentic hammam spa treatments, participate in Moroccan cooking classes, explore the bustling souks nearby, and immerse yourself in centuries-old culture, architecture, and hospitality.",
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
    description: "Witness nature's most spectacular light show at Iceland Northern Lights Hotel, featuring innovative glass-roofed suites designed specifically for aurora viewing from the comfort of your bed. Our modern eco-friendly property harnesses geothermal energy for heating and features natural hot spring spa facilities surrounded by dramatic Icelandic landscapes. Enjoy New Nordic cuisine highlighting fresh local ingredients, including lamb, seafood, and unique Icelandic specialties. Take advantage of our complimentary aurora wake-up service, explore nearby geysers and waterfalls, and experience the raw natural beauty of this extraordinary volcanic island.",
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
    description: "Experience the dramatic natural beauty of South Africa at Cape Town Oceanfront Resort, majestically positioned at the foot of iconic Table Mountain with stunning Atlantic Ocean views. Our resort offers easy access to pristine beaches, world-renowned wine regions, and incredible wildlife reserves. Enjoy luxurious amenities including multiple pools, a world-class spa, and restaurants serving exceptional African cuisine and fine local wines. Embark on exciting safari tours, cage dive with great white sharks, explore the Cape of Good Hope, and witness breathtaking sunsets over the ocean.",
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
    description: "Immerse yourself in the vibrant energy and rich culture of Thailand at Bangkok Riverside Hotel, elegantly positioned along the historic Chao Phraya River. Our luxury property seamlessly blends traditional Thai architectural elements with contemporary comforts and modern amenities. Experience authentic Thai hospitality, indulge in traditional Thai massage and spa treatments, and savor exquisite Thai cuisine at our riverside restaurants. Enjoy complimentary river shuttle service to major attractions including the Grand Palace, vibrant street markets, ornate temples, and bustling nightlife districts throughout this captivating city.",
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
    description: "Experience the timeless romance and elegance of Venice at Venice Canal Palace, a meticulously restored 16th-century palazzo overlooking the legendary Grand Canal. Our historic property features Venetian Gothic architecture, original frescoed ceilings, Murano glass chandeliers, and opulent period furnishings. Enjoy exclusive gondola service from our private dock, Michelin-starred Italian dining, and impeccable concierge service. Explore nearby St. Mark's Square, the Rialto Bridge, and hidden neighborhood gems. Witness stunning sunsets over the canals in this magical floating city steeped in art, history, and culture.",
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
    description: "Experience futuristic luxury at Singapore Sky Hotel, an ultra-modern architectural marvel in the heart of Marina Bay featuring a spectacular rooftop infinity pool with breathtaking 360-degree city skyline views. Our cutting-edge hotel showcases sleek contemporary design, advanced technology, and world-class amenities including Michelin-starred restaurants, a state-of-the-art spa, and premium fitness facilities. Perfectly positioned near Gardens by the Bay, shopping districts, and cultural attractions. Explore this dynamic multicultural city-state where East meets West, tradition meets innovation, and culinary excellence reaches extraordinary heights.",
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
    description: "Embark on an unforgettable adventure at Patagonia Wilderness Lodge, a remote luxury retreat nestled within the spectacular Torres del Paine National Park. Our eco-conscious lodge offers unparalleled access to towering granite peaks, ancient glaciers, turquoise lakes, and diverse wildlife including guanacos, pumas, and condors. Experienced naturalist guides lead trekking expeditions, wildlife viewing tours, and photography excursions through this pristine wilderness. Return from adventures to comfortable accommodations, gourmet cuisine featuring Patagonian lamb and local specialties, and panoramic views of some of Earth's most dramatic landscapes.",
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
    description: "Experience imperial grandeur and classical elegance at Vienna Imperial Hotel, a magnificent palace hotel located in Vienna's historic center near world-famous opera houses, museums, and architectural landmarks. Our hotel preserves the opulent atmosphere of the Habsburg Empire with crystal chandeliers, gilded furnishings, and marble staircases. Enjoy classical music concerts in our elegant concert hall, afternoon coffee and sachertorte in traditional Viennese style, and exceptional Austrian and international cuisine. Explore nearby Schönbrunn Palace, St. Stephen's Cathedral, and immerse yourself in Vienna's unparalleled cultural heritage.",
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



// Sample locations data (unique countries extracted from hotels)
const locations = [
  { name: "Maldives" },
  { name: "Switzerland" },
  { name: "United States" },
  { name: "Indonesia" },
  { name: "UAE" },
  { name: "United Kingdom" },
  { name: "Japan" },
  { name: "France" },
  { name: "Australia" },
  { name: "Brazil" },
  { name: "Greece" },
  { name: "Morocco" },
  { name: "Iceland" },
  { name: "South Africa" },
  { name: "Thailand" },
  { name: "Italy" },
  { name: "Singapore" },
  { name: "Chile" },
  { name: "Austria" }
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

    // Generate embeddings for hotels
    const hotelsWithEmbedding = hotels.map(async (hotel) => {
      console.log("Embedding hotel:", hotel.name);

      const embedding = await generateEmbedding(
        `${hotel.name} ${hotel.description} ${hotel.location} ${hotel.city} ${hotel.amenities.join(' ')} ${hotel.price}`
      );
      return { ...hotel, embedding };
    });

    const toBeCreatedHotels = await Promise.all(hotelsWithEmbedding);

    // Insert hotels with embeddings
    let createdHotels = await Hotel.insertMany(toBeCreatedHotels);
    console.log(`Created ${createdHotels.length} hotels`);

    // Create Stripe product with default price for each hotel
    console.log("\nCreating Stripe products for hotels...");
    const withStripe = await Promise.all(
      createdHotels.map(async (hotel) => {
        try {
          const product = await stripe.products.create({
            name: hotel.name,
            description: hotel.description,
            default_price_data: {
              unit_amount: Math.round(hotel.price * 100),
              currency: "usd",
            },
          });
          
          const defaultPriceId =
            typeof product.default_price === "string"
              ? product.default_price
              : (product.default_price as any)?.id;
          
          await Hotel.findByIdAndUpdate(
            hotel._id,
            { stripePriceId: defaultPriceId },
            { new: true }
          );
          
          console.log(`✓ Stripe product created for ${hotel.name}`);
          return { ...hotel.toObject(), stripePriceId: defaultPriceId };
        } catch (e) {
          console.warn(`⚠ Stripe setup failed for hotel ${hotel.name}:`, e);
          return hotel;
        }
      })
    );
    createdHotels = withStripe as any;
    console.log("\nStripe integration completed!");

    console.log("Database seeded successfully!");


    const getDateRange = (daysFromNow: number, duration: number) => {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + daysFromNow);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + duration);
      return { checkIn, checkOut };
    };

    const bookingSeedData = [
      {
        userId: userIds[0],
        hotelId: createdHotels[4]._id,
        roomNumber: "101",
        ...getDateRange(-30, 3), // Past booking - 30 days ago, 3 nights
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 450.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_1completed001',
        specialRequests: 'Late check-in requested',
        guestDetails: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      },
      {
        userId: userIds[0],
        hotelId: createdHotels[2]._id,
        roomNumber: "205",
        ...getDateRange(-15, 2), // Past booking - 15 days ago, 2 nights
        numberOfGuests: 1,
        numberOfRooms: 1,
        totalAmount: 280.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_1completed002',
        guestDetails: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      },
      {
        userId: userIds[0],
        hotelId: createdHotels[7]._id,
        roomNumber: "310",
        ...getDateRange(5, 4), // Upcoming booking - in 5 days, 4 nights
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 680.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_1upcoming001',
        specialRequests: 'Ocean view room preferred',
        guestDetails: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      },
      {
        userId: userIds[0],
        hotelId: createdHotels[5]._id,
        ...getDateRange(15, 5), // Upcoming booking - in 15 days, 5 nights
        numberOfGuests: 4,
        numberOfRooms: 2,
        totalAmount: 1250.00,
        paymentStatus: 'PENDING',
        specialRequests: 'Family vacation, need connecting rooms',
        guestDetails: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      },
      {
        userId: userIds[0],
        hotelId: createdHotels[3]._id,
        ...getDateRange(-5, 3), // Recent cancelled booking
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 390.00,
        paymentStatus: 'CANCELLED',
        paymentIntentId: 'pi_1cancelled001',
        guestDetails: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      },

      // User 2 Bookings - More active and upcoming
      {
        userId: userIds[1],
        hotelId: createdHotels[6]._id,
        roomNumber: "402",
        ...getDateRange(-2, 7), // Active booking - started 2 days ago, 7 nights total
        numberOfGuests: 3,
        numberOfRooms: 1,
        totalAmount: 980.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_2active001',
        specialRequests: 'Anniversary celebration, champagne on arrival',
        guestDetails: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891'
        }
      },
      {
        userId: userIds[1],
        hotelId: createdHotels[7]._id,
        roomNumber: "501",
        ...getDateRange(10, 3), // Upcoming booking - in 10 days, 3 nights
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 540.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_2upcoming001',
        guestDetails: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891'
        }
      },
      {
        userId: userIds[1],
        hotelId: createdHotels[11]._id,
        ...getDateRange(25, 2), // Upcoming booking - in 25 days, 2 nights
        numberOfGuests: 1,
        numberOfRooms: 1,
        totalAmount: 320.00,
        paymentStatus: 'PENDING',
        specialRequests: 'Business trip, need early check-in',
        guestDetails: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891'
        }
      },
      {
        userId: userIds[1],
        hotelId: createdHotels[6]._id,
        ...getDateRange(-45, 4), // Past completed booking
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 620.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_2completed001',
        guestDetails: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891'
        }
      },
      {
        userId: userIds[1],
        hotelId: createdHotels[8]._id,
        ...getDateRange(-20, 2), // Past refunded booking
        numberOfGuests: 1,
        numberOfRooms: 1,
        totalAmount: 280.00,
        paymentStatus: 'REFUNDED',
        paymentIntentId: 'pi_2refunded001',
        specialRequests: 'Emergency cancellation due to illness',
        guestDetails: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891'
        }
      },

      // User 3 Bookings - Mix with more completed bookings
      {
        userId: userIds[2],
        hotelId: createdHotels[4]._id,
        roomNumber: "302",
        ...getDateRange(-60, 5), // Past completed - 60 days ago
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 750.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_3completed001',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      },
      {
        userId: userIds[2],
        hotelId: createdHotels[0]._id,
        roomNumber: "404",
        ...getDateRange(-40, 3), // Past completed - 40 days ago
        numberOfGuests: 4,
        numberOfRooms: 2,
        totalAmount: 920.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_3completed002',
        specialRequests: 'Kids friendly room setup',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      },
      {
        userId: userIds[2],
        hotelId: createdHotels[1]._id,
        roomNumber: "201",
        ...getDateRange(-10, 4), // Recent completed - 10 days ago
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 560.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_3completed003',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      },
      {
        userId: userIds[2],
        hotelId: createdHotels[4]._id,
        roomNumber: "505",
        ...getDateRange(7, 6), // Upcoming booking - in 7 days, 6 nights
        numberOfGuests: 3,
        numberOfRooms: 2,
        totalAmount: 1380.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_3upcoming001',
        specialRequests: 'Group booking, rooms close to each other',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      },
      {
        userId: userIds[2],
        hotelId: createdHotels[4]._id,
        ...getDateRange(20, 3), // Upcoming booking - in 20 days, 3 nights
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 480.00,
        paymentStatus: 'PENDING',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      },
      {
        userId: userIds[2],
        hotelId: createdHotels[4]._id,
        ...getDateRange(30, 7), // Future upcoming booking - in 30 days, 7 nights
        numberOfGuests: 5,
        numberOfRooms: 3,
        totalAmount: 2100.00,
        paymentStatus: 'PENDING',
        specialRequests: 'Extended family vacation, need help with transportation',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      },
      {
        userId: userIds[2],
        hotelId: createdHotels[4]._id,
        ...getDateRange(-25, 2), // Past cancelled booking
        numberOfGuests: 1,
        numberOfRooms: 1,
        totalAmount: 240.00,
        paymentStatus: 'CANCELLED',
        paymentIntentId: 'pi_3cancelled001',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      },

      // Additional mixed bookings for variety
      {
        userId: userIds[0],
        hotelId: createdHotels[4]._id,
        roomNumber: "105",
        ...getDateRange(-90, 10), // Old completed booking - 3 months ago
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 1500.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_1completed003',
        specialRequests: 'Extended stay for business',
        guestDetails: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      },
      {
        userId: userIds[1],
        hotelId: createdHotels[4]._id,
        ...getDateRange(45, 14), // Far future booking - in 45 days, 2 weeks
        numberOfGuests: 6,
        numberOfRooms: 3,
        totalAmount: 3920.00,
        paymentStatus: 'PENDING',
        specialRequests: 'Summer vacation, pool access required',
        guestDetails: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891'
        }
      },
      {
        userId: userIds[2],
        hotelId: createdHotels[4]._id,
        roomNumber: "603",
        ...getDateRange(-1, 5), // Active booking - started yesterday, 5 nights
        numberOfGuests: 2,
        numberOfRooms: 1,
        totalAmount: 850.00,
        paymentStatus: 'PAID',
        paymentIntentId: 'pi_3active001',
        specialRequests: 'Honeymoon suite preferred',
        guestDetails: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1234567892'
        }
      }
    ];


    // Clear existing bookings (optional - comment out if you want to keep existing data)
    await Booking.deleteMany({});
    console.log('\nCleared existing bookings');

    // Insert seed data with proper date conversion
    const bookingsToInsert = bookingSeedData.map(booking => ({
      ...booking,
      checkInDate: booking.checkIn,
      checkOutDate: booking.checkOut,
      checkIn: undefined,
      checkOut: undefined
    }));

    const insertedBookings = await Booking.insertMany(bookingsToInsert);
    console.log(`\nSuccessfully seeded ${insertedBookings.length} bookings`);

    // Display summary
    const summary = await Booking.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nBooking Status Summary:');
    summary.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}`);
    });


    // Display summary
    console.log("\n=== SEED SUMMARY ===");
    console.log(`Locations: ${createdLocations.length}`);
    console.log(`Hotels: ${createdHotels.length}`);
    console.log(`Hotels with Stripe: ${createdHotels.filter((h: any) => h.stripePriceId).length}`);
    console.log(`Bookings: ${insertedBookings.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};



const userIds = [
  "user_34CBR0CcyKu7BLKTojDEMJ4uhYl",
  "user_34Johsb4jScIbDhomZS4JQKslji",
  "user_34MBRNZmkUFthKDNdhZ27GgEUet"
];




// Run the seed script
seedDatabase();