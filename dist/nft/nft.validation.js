"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNFT = void 0;
const express_validator_1 = require("express-validator");
exports.createNFT = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required.').isString().withMessage('Name must be a string.'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required.').isString().withMessage('Description must be a string.'),
    (0, express_validator_1.body)('attributes').notEmpty().withMessage('Attributes are required.').isString().withMessage('Attributes must be a string.'),
];
