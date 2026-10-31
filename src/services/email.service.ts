import nodemailer from "nodemailer";
import env from "../config/env.js";

const emailTransporter = nodemailer.createTransport({
    host: env.emailHost,
    port:env.emailPort,
    secure:false,
    auth:{user:env.emailUser, pass:env.emailPassword,},
});

export async function sendEmail(to:string, subject:string, text:string,):Promise<void>{
    await emailTransporter.sendMail({from:env.emailFrom, to, subject, text,});
}