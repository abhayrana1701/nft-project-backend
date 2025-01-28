"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRateLimiter = void 0;
const rate_limiter_config_1 = require("../config/rate.limiter.config");
const applyRateLimiter = (req, res, next) => {
    (0, rate_limiter_config_1.limiter)(req, res, next);
};
exports.applyRateLimiter = applyRateLimiter;
