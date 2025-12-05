"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_1 = require("../application/location");
const authentication_middleware_1 = __importDefault(require("./middleware/authentication-middleware"));
const locationsRouter = express_1.default.Router();
locationsRouter
    .route("/")
    .get(location_1.getAllLocations)
    .post(authentication_middleware_1.default, location_1.createLocation);
locationsRouter
    .route("/:_id")
    .get(location_1.getLocationById)
    .put(location_1.updateLocation)
    .patch(location_1.patchLocation)
    .delete(location_1.deleteLocation);
exports.default = locationsRouter;
//# sourceMappingURL=location.js.map