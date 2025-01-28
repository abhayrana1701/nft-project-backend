
import { body } from 'express-validator';

export const createNFT = [
    body('name').notEmpty().withMessage('Name is required.').isString().withMessage('Name must be a string.'),
    body('description').notEmpty().withMessage('Description is required.').isString().withMessage('Description must be a string.'),
    body('attributes').notEmpty().withMessage('Attributes are required.').isString().withMessage('Attributes must be a string.'),
];
