import { Schema , model , type InferSchemaType } from "mongoose";


const sessionSchema = new Schema(
    {
        userId: {
            type:Schema.Types.ObjectId,
            ref:"User",
            require: true , 
            index: true ,
        },

        refreshTokenHash: {
            type: String,
            required: true ,
            unique:true,
            select:false,
        },

        expiresAt: {
            type: Date,
            required:true,
            index:true,
        },

        revokedAt: {
            type:Date,
            default:null,
        },
    },
    {
        timestamps:true,
    },
);

export type Session = InferSchemaType<typeof sessionSchema>;

export const SessionModel = model<Session>("Session",sessionSchema);