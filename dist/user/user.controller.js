"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshController = exports.loginController = exports.registerController = void 0;
const user_service_1 = require("./user.service");
/**
 * Controller function for user registration.
 * It receives the user details (name, email, password) and creates a new user, then returns access and refresh tokens.
 *
 * @param {Request} req - The request object containing the user details.
 * @param {Response} res - The response object to send the response back.
 *
 * @returns {Promise<Response>} A JSON response containing the user information, access token, and refresh token.
 */
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const { user, accessToken, refreshToken } = yield (0, user_service_1.registerUser)(name, email, password);
        res.status(201).json({
            message: "User created successfully",
            accessToken,
            refreshToken,
            user: { name: user.name, email: user.email },
        });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ message: e.message });
    }
});
exports.registerController = registerController;
/**
 * Controller function for user login.
 * It authenticates the user with the provided email and password, and returns access and refresh tokens.
 *
 * @param {Request} req - The request object containing the user's login credentials.
 * @param {Response} res - The response object to send the response back.
 *
 * @returns {Promise<Response>} A JSON response containing the user information, access token, and refresh token.
 */
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = yield (0, user_service_1.loginUser)(email, password);
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: { name: user.name, email: user.email },
        });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ message: e.message });
    }
});
exports.loginController = loginController;
/**
 * Controller function to refresh the access token using the provided refresh token.
 *
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object to send the new access token.
 *
 * @returns {Promise<Response>} A JSON response containing the new access token.
 */
const refreshController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const { newAccessToken } = yield (0, user_service_1.refreshAccessToken)(refreshToken);
        res.status(200).json({
            message: "Access token refreshed successfully",
            newAccessToken,
        });
    }
    catch (error) {
        const e = error;
        res.status(400).json({ message: e.message });
    }
});
exports.refreshController = refreshController;
