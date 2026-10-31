import type { CookieOptions, Response } from "express";
import env from "../config/env.js";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const REFRESH_TOKEN_COOKIE_PATH = "/api/auth";

function getRefreshTokenCookieOptions(): CookieOptions {
   return {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: REFRESH_TOKEN_COOKIE_PATH,
   };
}

export function setRefreshTokenCookie(res: Response, refreshToken: string , expiresAt: Date): void {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken,{ ...getRefreshTokenCookieOptions(), expires: expiresAt,});
}

export function clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getRefreshTokenCookieOptions());
}