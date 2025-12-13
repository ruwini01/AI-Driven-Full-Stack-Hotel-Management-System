"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("@clerk/express");
const forbidden_error_1 = __importDefault(require("../../domain/errors/forbidden-error"));
const isAdmin = (req, res, next) => {
    const auth = (0, express_1.getAuth)(req);
    if (auth?.sessionClaims?.metadata?.role !== "admin") {
        throw new forbidden_error_1.default("Forbidden");
    }
    next();
};
exports.default = isAdmin;
//# sourceMappingURL=authorization-middleware.js.map