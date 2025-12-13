"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unauthorized_error_1 = __importDefault(require("../../domain/errors/unauthorized-error"));
const isAuthenticated = (req, res, next) => {
    // console.log(req.auth()); // If the authorization header is not present or clerk BE tells it is invalid, this will return null
    const authData = req.auth();
    console.log("AUTH_OBJECT", authData);
    console.log("IS_AUTHENTICATED", authData.isAuthenticated);
    if (!authData.isAuthenticated) {
        throw new unauthorized_error_1.default("Unauthorized");
    }
    next();
};
exports.default = isAuthenticated;
//# sourceMappingURL=authentication-middleware.js.map