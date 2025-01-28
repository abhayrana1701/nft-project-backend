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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.loginUser = exports.registerUser = void 0;
const user_schema_1 = __importDefault(require("./user.schema"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Registers a new user by creating their record and generating authentication tokens.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 *
 * @returns {Promise<Object>} An object containing the newly created user, access token, and refresh token.
 */
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_schema_1.default.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const newUser = new user_schema_1.default({
        name,
        email,
        password,
        refreshToken: null,
    });
    yield newUser.save();
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = (0, exports.generateRefreshToken)(newUser._id);
    newUser.refreshToken = refreshToken;
    yield newUser.save();
    return { user: newUser, accessToken, refreshToken };
});
exports.registerUser = registerUser;
/**
 * Authenticates a user by verifying their email and password, and generates authentication tokens.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 *
 * @returns {Promise<Object>} An object containing the authenticated user, access token, and refresh token.
 */
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.default.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = (0, exports.generateRefreshToken)(user._id);
    user.refreshToken = refreshToken;
    yield user.save();
    return { user, accessToken, refreshToken };
});
exports.loginUser = loginUser;
/**
 * Generates an access token for a user.
 *
 * @param {string} userId - The user's ID.
 *
 * @returns {string} The generated access token.
 */
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
/**
 * Generates a refresh token for a user.
 *
 * @param {string} userId - The user's ID.
 *
 * @returns {string} The generated refresh token.
 */
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verifies an access token and decodes the user's payload.
 *
 * @param {string} token - The access token to verify.
 *
 * @returns {IUserPayload} The decoded user payload.
 */
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error("Invalid or expired access token");
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Refreshes an access token using a valid refresh token.
 *
 * @param {string} refreshToken - The refresh token used to generate a new access token.
 *
 * @returns {Promise<Object>} An object containing the new access token.
 */
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        const user = yield user_schema_1.default.findById(decoded.userId);
        if (!user) {
            throw new Error("User not found");
        }
        const newAccessToken = generateAccessToken(user._id);
        return { newAccessToken };
    }
    catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
});
exports.refreshAccessToken = refreshAccessToken;
