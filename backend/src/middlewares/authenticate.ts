// import { Request, Response, NextFunction} from "express"
// import config from "../config/config";
// import { verify } from "jsonwebtoken";
// // import { verify } from "crypto";

// export interface AuthRequest extends Request{
//   UserId: string;
// }
// const authenticate = (req: Request, res: Response, next: NextFunction)=>{
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({message: 'Authorization token is required'})
//   }
//   try {
//     const parsedText = token.split(" ")[1];
//     const decoded = verify(parsedText, config.JwtSecret as string);
//     const _request = req as AuthRequest;
//     _request.UserId = decoded.sub as string;

//    return next()
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// }

// export default authenticate;


import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import { verify } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  UserId: string;
  role?: string;
}

const authenticate = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' });
    }

    try {
      const parsedToken = token.split(' ')[1]; // splits the jwt into 3 parts(headers,payload,signature) with a dot.
      const decoded = verify(parsedToken, config.JwtSecret as string) as {
        sub: string;
        role: string;
      };

      const _request = req as AuthRequest;
      _request.UserId = decoded.sub;
      _request.role = decoded.role; 

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

export default authenticate;
