import type { Request, Response, NextFunction } from "express";
import { createPasswordResetRequest } from "../services/passwordReset.service.js";
import { resetPassword } from "../services/passwordReset.service.js";

export async function forgetPassword(req:Request, res:Response, next:NextFunction):Promise<void>{
    try{
        const {email} = req.body;

    await createPasswordResetRequest(email);

    res.status(200).json({message:"if an account with that aemail exists, a password reset email will be sent.",});
    }catch(error){
        next(error);
    }
}



export async function resetPasswordController(req:Request, res:Response, next:NextFunction):Promise<void>{
    try{
        const {token , newPassword} = req.body;

        await resetPassword(token, newPassword);

        res.status(200).json({
            message:"password has been reset successfully.",
        });
    }catch(error){
        next(error);
    }
}