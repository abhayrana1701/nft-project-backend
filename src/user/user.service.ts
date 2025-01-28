import User from "./user.schema"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface IUserPayload {
  userId: string;
  _id: string;
}

/**
 * Registers a new user by creating their record and generating authentication tokens.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns {Promise<Object>} An object containing the newly created user, access token, and refresh token.
 */
export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = new User({
    name,
    email,
    password,
    refreshToken: null,
  });

  await newUser.save();

  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;
  await newUser.save();

  return { user: newUser, accessToken, refreshToken };
};

/**
 * Authenticates a user by verifying their email and password, and generates authentication tokens.
 * 
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns {Promise<Object>} An object containing the authenticated user, access token, and refresh token.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

/**
 * Generates an access token for a user.
 * 
 * @param {string} userId - The user's ID.
 * 
 * @returns {string} The generated access token.
 */
const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

/**
 * Generates a refresh token for a user.
 * 
 * @param {string} userId - The user's ID.
 * 
 * @returns {string} The generated refresh token.
 */
export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

/**
 * Verifies an access token and decodes the user's payload.
 * 
 * @param {string} token - The access token to verify.
 * 
 * @returns {IUserPayload} The decoded user payload.
 */
export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as IUserPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Refreshes an access token using a valid refresh token.
 * 
 * @param {string} refreshToken - The refresh token used to generate a new access token.
 * 
 * @returns {Promise<Object>} An object containing the new access token.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as IUserPayload;
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = generateAccessToken(user._id);

    return { newAccessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
