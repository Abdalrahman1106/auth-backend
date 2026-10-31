import crypto from "node:crypto";

export function generatePasswordResetToken():{token:string; hashToken:string;}{
    const token = crypto.randomBytes(32).toString("hex");

    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    return{
        token, 
        hashToken,
    };
}