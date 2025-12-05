"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHotelEmbeddings = exports.deleteHotel = exports.patchHotel = exports.updateHotel = exports.getHotelById = exports.createHotel = exports.getAllHotelsBySearchQuery = exports.getAllHotels = void 0;
const Hotel_1 = __importDefault(require("../infrastructure/entities/Hotel"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const embeddings_1 = require("./utils/embeddings");
const hotel_1 = require("../domain/dtos/hotel");
const mongodb_1 = require("mongodb");
const getAllHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel_1.default.find();
        res.status(200).json(hotels);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllHotels = getAllHotels;
const getAllHotelsBySearchQuery = async (req, res, next) => {
    try {
        const result = hotel_1.SearchHotelDTO.safeParse(req.query);
        if (!result.success) {
            throw new validation_error_1.default(`${result.error.message}`);
        }
        const { query } = result.data;
        console.log("🔍 Searching for:", query);
        try {
            // Try vector search first
            const queryEmbedding = await (0, embeddings_1.generateEmbedding)(query);
            console.log("✅ Generated embedding");
            const hotels = await Hotel_1.default.aggregate([
                {
                    $vectorSearch: {
                        index: "hotel_vector_index",
                        path: "embedding",
                        queryVector: queryEmbedding,
                        numCandidates: 25,
                        limit: 4,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        location: 1,
                        city: 1,
                        rating: 1,
                        reviews: 1,
                        price: 1,
                        stars: 1,
                        featured: 1,
                        description: 1,
                        amenities: 1,
                        images: 1,
                        roomTypes: 1,
                        score: { $meta: "vectorSearchScore" }, // Include similarity score
                    },
                },
            ]);
            console.log(`✅ Found ${hotels.length} hotels via vector search`);
            res.status(200).json(hotels);
        }
        catch (vectorError) {
            // Fallback to text search if vector search fails
            console.log("⚠️ Vector search failed, falling back to text search:", vectorError);
            const hotels = await Hotel_1.default.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { location: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                ],
            }).limit(10);
            console.log(`✅ Found ${hotels.length} hotels via text search`);
            res.status(200).json(hotels);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getAllHotelsBySearchQuery = getAllHotelsBySearchQuery;
const createHotel = async (req, res, next) => {
    try {
        const hotelData = req.body;
        const result = hotel_1.CreateHotelDTO.safeParse(hotelData);
        if (!result.success) {
            throw new validation_error_1.default(`${result.error.message}`);
        }
        const embedding = await (0, embeddings_1.generateEmbedding)(`${result.data.name} ${result.data.description} ${result.data.location} ${result.data.price}`);
        await Hotel_1.default.create({ ...result.data, embedding });
        res.status(201).send();
    }
    catch (error) {
        next(error);
    }
};
exports.createHotel = createHotel;
const getHotelById = async (req, res, next) => {
    try {
        const _id = req.params._id;
        const hotel = await Hotel_1.default.findById(_id);
        if (!hotel) {
            throw new not_found_error_1.default("Hotel not found");
        }
        res.status(200).json(hotel);
    }
    catch (error) {
        next(error);
    }
};
exports.getHotelById = getHotelById;
const updateHotel = async (req, res, next) => {
    try {
        const _id = req.params._id;
        const hotelData = req.body;
        // validate required fields
        if (!hotelData.name ||
            !hotelData.location ||
            !hotelData.price ||
            !hotelData.description) {
            throw new validation_error_1.default("Invalid hotel data");
        }
        const hotel = await Hotel_1.default.findById({ _id: new mongodb_1.ObjectId(_id) });
        if (!hotel) {
            throw new not_found_error_1.default("Hotel not found");
        }
        await Hotel_1.default.findByIdAndUpdate(_id, hotelData, { new: true });
        res.status(200).json(hotelData);
    }
    catch (error) {
        next(error);
    }
};
exports.updateHotel = updateHotel;
const patchHotel = async (req, res, next) => {
    try {
        const _id = req.params._id;
        const hotelData = req.body;
        if (!hotelData.price) {
            throw new validation_error_1.default("Price is required");
        }
        const hotel = await Hotel_1.default.findById(_id);
        if (!hotel) {
            throw new not_found_error_1.default("Hotel not found");
        }
        await Hotel_1.default.findByIdAndUpdate(_id, { price: hotelData.price });
        res.status(200).send();
    }
    catch (error) {
        next(error);
    }
};
exports.patchHotel = patchHotel;
const deleteHotel = async (req, res, next) => {
    try {
        const _id = req.params._id;
        const hotel = await Hotel_1.default.findById(_id);
        if (!hotel) {
            throw new not_found_error_1.default("Hotel not found");
        }
        await Hotel_1.default.findByIdAndDelete(_id);
        res.status(200).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteHotel = deleteHotel;
// In hotel.ts controller
const checkHotelEmbeddings = async (req, res, next) => {
    try {
        const hotels = await Hotel_1.default.find();
        const hotelsWithEmbeddings = hotels.filter(h => h.embedding && h.embedding.length > 0);
        const hotelsWithoutEmbeddings = hotels.filter(h => !h.embedding || h.embedding.length === 0);
        res.status(200).json({
            total: hotels.length,
            withEmbeddings: hotelsWithEmbeddings.length,
            withoutEmbeddings: hotelsWithoutEmbeddings.length,
            hotelsWithoutEmbeddings: hotelsWithoutEmbeddings.map(h => ({ id: h._id, name: h.name }))
        });
    }
    catch (error) {
        next(error);
    }
};
exports.checkHotelEmbeddings = checkHotelEmbeddings;
//# sourceMappingURL=hotel.js.map