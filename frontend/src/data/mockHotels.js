export const mockHotels = [
  {
    id: "1",
    name: "Ocean Paradise Resort",
    location: "Maldives",
    city: "Male",
    rating: 4.9,
    reviews: 1243,
    price: 450,
    stars: 5,
    featured: true,
    description:
      "Experience luxury like never before at Ocean Paradise Resort, where crystal-clear waters meet pristine white beaches. Our overwater villas offer unparalleled views and world-class amenities.",
    amenities: [
      "WiFi",
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Gym",
      "Beach Access",
      "Room Service",
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Overwater Villa", price: 450, available: 5 },
      { name: "Beach Villa", price: 350, available: 8 },
      { name: "Garden Suite", price: 250, available: 12 },
    ],
  },
  {
    id: "2",
    name: "Mountain Peak Lodge",
    location: "Swiss Alps",
    city: "Zermatt",
    rating: 4.8,
    reviews: 892,
    price: 380,
    stars: 5,
    featured: true,
    description:
      "Nestled in the heart of the Swiss Alps, Mountain Peak Lodge offers breathtaking mountain views and cozy alpine charm. Perfect for winter sports enthusiasts and nature lovers.",
    amenities: [
      "WiFi",
      "Spa",
      "Restaurant",
      "Bar",
      "Gym",
      "Ski Storage",
      "Fireplace",
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Alpine Suite", price: 380, available: 6 },
      { name: "Mountain View Room", price: 280, available: 10 },
      { name: "Cozy Chalet", price: 480, available: 3 },
    ],
  },
  {
    id: "3",
    name: "Urban Skyline Hotel",
    location: "New York, USA",
    city: "Manhattan",
    rating: 4.7,
    reviews: 2156,
    price: 320,
    stars: 4,
    featured: false,
    description:
      "Located in the heart of Manhattan, Urban Skyline Hotel offers stunning city views and modern luxury. Steps away from Times Square and Central Park.",
    amenities: [
      "WiFi",
      "Pool",
      "Restaurant",
      "Bar",
      "Gym",
      "Business Center",
      "Concierge",
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Skyline Suite", price: 420, available: 4 },
      { name: "Deluxe Room", price: 320, available: 15 },
      { name: "Executive Suite", price: 520, available: 2 },
    ],
  },
  {
    id: "4",
    name: "Tropical Garden Resort",
    location: "Bali, Indonesia",
    city: "Ubud",
    rating: 4.9,
    reviews: 1567,
    price: 280,
    stars: 5,
    featured: true,
    description:
      "Immerse yourself in Balinese culture at Tropical Garden Resort. Surrounded by lush rice terraces and tropical gardens, this peaceful retreat offers ultimate relaxation.",
    amenities: [
      "WiFi",
      "Pool",
      "Spa",
      "Restaurant",
      "Yoga Studio",
      "Cultural Activities",
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Villa with Pool", price: 380, available: 7 },
      { name: "Garden View Room", price: 280, available: 12 },
      { name: "Luxury Suite", price: 480, available: 4 },
    ],
  },
  {
    id: "5",
    name: "Desert Oasis Hotel",
    location: "Dubai, UAE",
    city: "Dubai",
    rating: 4.8,
    reviews: 1834,
    price: 420,
    stars: 5,
    featured: false,
    description:
      "Experience Arabian luxury in the heart of Dubai. Our Desert Oasis Hotel combines traditional hospitality with modern elegance.",
    amenities: [
      "WiFi",
      "Pool",
      "Spa",
      "Restaurant",
      "Bar",
      "Gym",
      "Desert Safari",
      "Private Beach",
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Royal Suite", price: 620, available: 2 },
      { name: "Premium Room", price: 420, available: 10 },
      { name: "Deluxe Room", price: 320, available: 15 },
    ],
  },
  {
    id: "6",
    name: "Coastal Breeze Inn",
    location: "California, USA",
    city: "Santa Monica",
    rating: 4.6,
    reviews: 987,
    price: 220,
    stars: 4,
    featured: false,
    description:
      "Charming beachfront inn offering comfortable rooms and easy access to Santa Monica Pier and Venice Beach. Perfect for a California coastal getaway.",
    amenities: ["WiFi", "Beach Access", "Restaurant", "Bike Rental", "Parking"],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Ocean View Room", price: 280, available: 8 },
      { name: "Standard Room", price: 220, available: 12 },
      { name: "Suite", price: 380, available: 5 },
    ],
  },
  {
    id: "7",
    name: "Historic Castle Hotel",
    location: "Scotland, UK",
    city: "Edinburgh",
    rating: 4.7,
    reviews: 745,
    price: 350,
    stars: 5,
    featured: false,
    description:
      "Stay in a real Scottish castle with centuries of history. Elegant rooms, fine dining, and stunning Highland views await.",
    amenities: [
      "WiFi",
      "Restaurant",
      "Bar",
      "Library",
      "Gardens",
      "Historic Tours",
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Tower Suite", price: 450, available: 3 },
      { name: "Castle Room", price: 350, available: 8 },
      { name: "Garden View", price: 280, available: 10 },
    ],
  },
  {
    id: "8",
    name: "Zen Garden Retreat",
    location: "Kyoto, Japan",
    city: "Kyoto",
    rating: 4.9,
    reviews: 1123,
    price: 310,
    stars: 5,
    featured: true,
    description:
      "Traditional Japanese ryokan featuring tatami rooms, onsen baths, and authentic kaiseki cuisine. A peaceful escape in historic Kyoto.",
    amenities: [
      "WiFi",
      "Onsen",
      "Restaurant",
      "Tea Ceremony",
      "Garden",
      "Meditation Room",
    ],
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    roomTypes: [
      { name: "Ryokan Suite", price: 410, available: 6 },
      { name: "Traditional Room", price: 310, available: 10 },
      { name: "Garden Suite", price: 510, available: 3 },
    ],
  },
];

// 🔍 Utility functions

export const getHotelById = (id) => mockHotels.find((hotel) => hotel.id === id);

export const getFeaturedHotels = () =>
  mockHotels.filter((hotel) => hotel.featured);

export const getHotelsByCity = (city) =>
  mockHotels.filter((hotel) =>
    hotel.city.toLowerCase().includes(city.toLowerCase())
  );

export const filterHotels = (filters) => {
  return mockHotels.filter((hotel) => {
    if (filters.minPrice && hotel.price < filters.minPrice) return false;
    if (filters.maxPrice && hotel.price > filters.maxPrice) return false;
    if (filters.minRating && hotel.rating < filters.minRating) return false;
    if (
      filters.cities &&
      filters.cities.length > 0 &&
      !filters.cities.includes(hotel.city)
    )
      return false;
    if (
      filters.stars &&
      filters.stars.length > 0 &&
      !filters.stars.includes(hotel.stars)
    )
      return false;
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        hotel.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }
    return true;
  });
};
