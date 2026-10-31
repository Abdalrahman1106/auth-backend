import {Request, Response, NextFunction} from "express";
import { loginUser, registerUser } from "../services/auth.service.js";
import { signAccessToken } from "../utils/jwt.js";
import { createSession } from "../services/session.service.js";
import { setRefreshTokenCookie, REFRESH_TOKEN_COOKIE_NAME , clearRefreshTokenCookie} from "../utils/cookies.js";
import {rotateRefreshToken, revokeSession} from "../services/session.service.js";


export async function registerController(req: Request, res: Response, next: NextFunction):Promise<void>{
    try {
        const {name , email , password} = req.body;
        const user = await registerUser({ name, email, password });

        res.status(201).json({ message: "User registered successfully", 
            user:{
            id: user.id ,
             name: user.name ,
              email: user.email ,
            role: user.role ,
        isemailVerified: user.isEmailVerified},
     });
    }catch (error) {
        next(error);
    }
}



export async function loginController(req: Request, res: Response, next: NextFunction):Promise<void>{
    try {
        const {email , password} = req.body;
        const user = await loginUser({ email, password });

        const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });

        const session = await createSession( user._id.toString());

        setRefreshTokenCookie(res, session.refreshToken, session.expiresAt);

    res.status(200).json({ message: "Login successfully",
             accessToken , 
            user:{ id: user._id, name: user.name, email: user.email, role: user.role , isEmailVerified: user.isEmailVerified } ,
        });
    }catch (error) {
        next(error);
    }
}


export function meController(req: Request, res: Response, next: NextFunction): void {
    const auth = res.locals.auth;
    res.status(200).json({ message: "Authenticated successfully", 
        user: { 
            id: auth.sub, role: auth.role 
        } });
}

export async function refreshController(req: Request, res: Response, next: NextFunction){
try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if(!refreshToken){
        res.status(401).json({ message: "Refresh token not found" });
        return;
    }

    const result = await rotateRefreshToken(refreshToken);
    const accessToken = signAccessToken({ sub: result.userId, role: result.role });

    setRefreshTokenCookie(res, result.refreshToken, result.expiresAt);

    res.status(200).json({ message: "Token refreshed successfully", accessToken });
} catch (error) {
    next(error);
}
}


export async function logoutController(req:Request,res:Response,next:NextFunction) {
    try{
        const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
        if(refreshToken){
            await revokeSession(refreshToken);
        }

        clearRefreshTokenCookie(res);

        res.status(200).json({message:"Logout Successfully"})
        
    }catch(error){
        next(error);
    }
}

