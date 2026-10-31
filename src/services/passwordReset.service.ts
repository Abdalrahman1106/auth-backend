import crypto from "node:crypto";
import bcrypt from "bcrypt";
import {UserModel} from "../models/user.js";
import { generatePasswordResetToken } from "../utils/passwordReset.js";
import  {sendEmail} from "./email.service.js";
import { revokedAllUserSessions } from "./session.service.js";


export async function createPasswordResetRequest(email:string,):Promise<string | null>{
    const user = await UserModel.findOne({email});

    if(!user){
        return null;
    }

    const {token, hashToken} = generatePasswordResetToken();

    user.passwordResetToken = hashToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetLink = `http://localhost:5000/reset-password?token=${token}`;

    await sendEmail(email, 
        "Reset Your Password", 
        `You requested a password reset.  
          open the following link to reset your password:${resetLink}   
                this link expires in 15 minutes.  
                   if you did not request this, please ignore this email.`,);

    return token;
}



export async function resetPassword(token:string, newPassword:string):Promise<void>{
    const hashToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    const user = await UserModel.findOne({
        passwordResetToken:hashToken,
        passwordResetExpires:{$gt:new Date()},
    });

    if(!user){
        throw new Error("invalid or expired password reset token");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);

    user.set("passwordResetToken", undefined);
    user.set("passwordResetExpires", undefined); 

    await user.save();
    await revokedAllUserSessions(user._id.toString());
}