
import { body } from 'express-validator';

export const registerUser = [
    body('name').notEmpty().withMessage('Name is required.').isString().withMessage('Name must be a string.'),
    body('email').notEmpty().withMessage('Email is required.').isString().withMessage('Email must be a string.'),
    body('password').notEmpty().withMessage('Password is required.').isString().withMessage('Password must be a string.'),
];

export const loginUser = [
  body('email').notEmpty().withMessage('Email is required.').isString().withMessage('Email must be a string.'),
  body('password').notEmpty().withMessage('Password is required.').isString().withMessage('Password must be a string.'),
];
