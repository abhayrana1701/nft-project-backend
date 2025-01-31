import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../user/user.service";  

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = verifyAccessToken(token); 
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
