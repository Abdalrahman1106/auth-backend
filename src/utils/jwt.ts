import jwt from "jsonwebtoken";
import env from "../config/env.js";

export type AccessTokenPayload = {
    sub: string;
role: "user" | "admin";
};

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: "15m" });
}


export function verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (typeof decoded === "string" || typeof decoded.sub !== "string" || ( decoded.role !== "user" &&  decoded.role !== "admin")) {
        throw new Error("Invalid access token");
    }

    return {
        sub: decoded.sub,
        role: decoded.role,
    };
}