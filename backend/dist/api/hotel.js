"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_1 = require("../application/hotel");
const authentication_middleware_1 = __importDefault(require("./middleware/authentication-middleware"));
const authorization_middleware_1 = __importDefault(require("./middleware/authorization-middleware"));
const ai_1 = require("../application/ai");
const hotelsRouter = express_1.default.Router();
const preMiddleware = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};
hotelsRouter
    .route("/")
    .get(hotel_1.getAllHotels)
    .post(authentication_middleware_1.default, authorization_middleware_1.default, hotel_1.createHotel);
hotelsRouter.route("/ai").post(ai_1.respondToAIQuery);
hotelsRouter.route("/search").get(hotel_1.getAllHotelsBySearchQuery);
hotelsRouter
    .route("/:_id")
    .get(authentication_middleware_1.default, hotel_1.getHotelById)
    .put(hotel_1.updateHotel)
    .patch(hotel_1.patchHotel)
    .delete(hotel_1.deleteHotel);
hotelsRouter
    .route("/:_id/stripe/price")
    .post(authentication_middleware_1.default, authorization_middleware_1.default, hotel_1.createHotelStripePrice);
// In hotels-router.ts
hotelsRouter.route("/check-embeddings").get(hotel_1.checkHotelEmbeddings);
exports.default = hotelsRouter;
//# sourceMappingURL=hotel.js.map