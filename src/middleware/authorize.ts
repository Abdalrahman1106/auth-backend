import type { Request , Response , NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import type { AccessTokenPayload } from "../utils/jwt.js";

type Role = "user" | "admin" ;

type AuthenticatedRequest = Request & {locals:{auth?:AccessTokenPayload;};};

export function authorize(...allowedRoles:Role[]){
    return(req:Request, res:Response, next:NextFunction):void => {
const auth = (req as AuthenticatedRequest).locals.auth;
if(!auth){
    next(new AppError("Authentication required",401));
    return;
}

if(!allowedRoles.includes(auth.role)){
    next(new AppError("You do not have permission to perform this action", 403));
    return;
}
next();
    };
}