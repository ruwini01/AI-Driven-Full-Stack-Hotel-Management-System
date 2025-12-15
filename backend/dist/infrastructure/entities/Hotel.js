"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomTypeSchema = new mongoose_1.default.Schema({
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
const hotelSchema = new mongoose_1.default.Schema({
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
const Hotel = mongoose_1.default.model("Hotel", hotelSchema);
exports.default = Hotel;
//# sourceMappingURL=Hotel.js.map