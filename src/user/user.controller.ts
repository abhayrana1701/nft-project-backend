import { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken } from "./user.service";

/**
 * Controller function for user registration.
 * It receives the user details (name, email, password) and creates a new user, then returns access and refresh tokens.
 * 
 * @param {Request} req - The request object containing the user details.
 * @param {Response} res - The response object to send the response back.
 * 
 * @returns {Promise<Response>} A JSON response containing the user information, access token, and refresh token.
 */
export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await registerUser(name, email, password);

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ message: e.message });
  }
};

/**
 * Controller function for user login.
 * It authenticates the user with the provided email and password, and returns access and refresh tokens.
 * 
 * @param {Request} req - The request object containing the user's login credentials.
 * @param {Response} res - The response object to send the response back.
 * 
 * @returns {Promise<Response>} A JSON response containing the user information, access token, and refresh token.
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ message: e.message });
  }
};

/**
 * Controller function to refresh the access token using the provided refresh token.
 * 
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object to send the new access token.
 * 
 * @returns {Promise<Response>} A JSON response containing the new access token.
 */
export const refreshController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const { newAccessToken } = await refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Access token refreshed successfully",
      newAccessToken,
    });
  } catch (error) {
    const e = error as Error;
    res.status(400).json({ message: e.message });
  }
};
