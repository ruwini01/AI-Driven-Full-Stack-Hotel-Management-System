"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHotelDTO = exports.CreateHotelDTO = void 0;
const zod_1 = require("zod");
exports.CreateHotelDTO = zod_1.z.object({
    name: zod_1.z.string(),
    location: zod_1.z.string(),
    city: zod_1.z.string(),
    rating: zod_1.z.number().min(0).max(5).optional(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    stars: zod_1.z.number().min(1).max(5),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    images: zod_1.z.array(zod_1.z.string()).nonempty("At least one image is required"),
});
exports.SearchHotelDTO = zod_1.z.object({
    query: zod_1.z.string().min(1),
});
//# sourceMappingURL=hotel.js.map