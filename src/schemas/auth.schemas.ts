import {z} from "zod";


export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name must be at most 50 characters long"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(72, "Password must be at most 72 characters long"),
});



export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(72, "Password must be at most 72 characters long"),
});


export const forgetPasswordSchema = z.object({
  email:z.string().trim().email("Invalid email address"),
});


export const resetPasswordSchema = z.object({
  token:z.string().min(1, "reset token is required"),
  newPassword:z.string().min(8, "password must be at least 8 characters"),
});
