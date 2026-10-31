import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import {AppError} from "../utils/AppError.js";
import jwt from "jsonwebtoken";


export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        next(new AppError("Authentication required", 401));
        return;
    }

    const token = authorization.slice("Bearer ".length);
    try {
        const payload = verifyAccessToken(token);
        res.locals.auth = payload;
        next();
    } catch(error: unknown){
       if(error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError || error instanceof jwt.NotBeforeError){
        next(new AppError("Invalid or expired token",401));
        return;
       }
       next(error);
    }
}