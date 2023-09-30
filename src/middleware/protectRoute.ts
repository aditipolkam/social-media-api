// middleware/protectRoute.ts
import { Response, NextFunction } from 'express';
import { CustomRequest, JwtPayload } from '../interfaces/express.generic';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/constants';

const protectRoute = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing.' });
    }
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    if (!decoded.userId) {
      return res.status(401).json({ message: 'User is not authenticated.' });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export default protectRoute;