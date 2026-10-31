import {SessionModel} from "../models/Session.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/refreshToken.js";
import mongoose from "mongoose";
import {UserModel} from "../models/user.js";
import { AppError } from "../utils/AppError.js";

const REFRESH_TOKEN_TTL_DAYS = 7;

export async function createSession(userId: string) {
    const refreshToken = generateRefreshToken();

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await SessionModel.create({
        userId,
        refreshTokenHash,
        expiresAt,
    });

    return {
        refreshToken,
        expiresAt,
    };
}

type RotateRefreshTokenResult = {
    refreshToken: string;
    expiresAt: Date;
    userId: string;
    role: "user" | "admin";
};
  
export async function rotateRefreshToken(refreshToken:string) {
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const dbSession = await mongoose.startSession();

    try {
       const result = await dbSession.withTransaction(async()=>{
       const currentSession = await SessionModel.findOne({refreshTokenHash,}).session(dbSession);

       if(!currentSession){
        throw new AppError("Invalid or expired refresh token", 401);
       }

       if(currentSession.revokedAt){
        throw new AppError("Invalid or expired refresh token", 401);
       }

       if(currentSession.expiresAt <= new Date()){
        throw new AppError("Invalid or expired refresh token", 401);
       }

       const user = await UserModel.findById(currentSession.userId,).session(dbSession);

       if(!user){
        throw new AppError("Invalid or expired refresh token", 401);
       }

       const claimedSession = await SessionModel.findOneAndUpdate(
        {
        _id: currentSession._id,
        revoked: null,
        expiresAt: {$gt: new Date()},
       },
       {
        $set: {revokedAt: new Date()}
       },
       {
        new: true,
        session:dbSession,
       },
    );

    if (!claimedSession){
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,);

    const newSession = new SessionModel({
    userId: user._id,
    refreshTokenHash: newRefreshTokenHash,
    expiresAt: newExpiresAt,
    });

    await newSession.save({session:dbSession});

  

    return {
        refreshToken:newRefreshToken,
        expiresAt:newExpiresAt,
        userId:user._id.toString(),
        role:user.role,
    };
});
    if(!result){
        throw new Error("Invalid or expired refresh token");
    }

    return result;
        
    } finally{
        await dbSession.endSession();
    }
}


export async function revokeSession(refreshToken:string):Promise<void> {
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await SessionModel.findOneAndUpdate(
        {
            refreshTokenHash,
            revokedAt:null,
        },
     {  $set:{revokedAt:new Date(),},  },
      
    );
}


export async function revokedAllUserSessions(userId:string,):Promise<void>{
    await SessionModel.updateMany({
        userId,
        revokedAt:null,
    },
    {$set:{revokedAt:new Date(),},},
);
}
 


