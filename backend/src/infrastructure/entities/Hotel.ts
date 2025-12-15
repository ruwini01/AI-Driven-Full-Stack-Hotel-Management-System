import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Number,
    required: true,
    default: 0,
  },
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  stripePriceId: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  roomTypes: {
    type: [roomTypeSchema],
    default: [],
  },
  embedding: {
    type: [Number],
    default: [],
  },
}, {
  timestamps: true,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;