import { Request, Response, NextFunction } from 'express';
import { limiter } from '../config/rate.limiter.config';

export const applyRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  limiter(req, res, next); 
};
