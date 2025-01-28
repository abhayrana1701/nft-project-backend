"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
exports.registerUser = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required.').isString().withMessage('Name must be a string.'),
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email is required.').isString().withMessage('Email must be a string.'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required.').isString().withMessage('Password must be a string.'),
];
exports.loginUser = [
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email is required.').isString().withMessage('Email must be a string.'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required.').isString().withMessage('Password must be a string.'),
];
