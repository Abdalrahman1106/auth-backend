import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { ZodError } from "zod";

const errorHandeler:ErrorRequestHandler = (err,req,res,next) => {

if(err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err){
    res.status(400).json({
        status:"fail",
        message:"Invalid JSON format"
    });
    return;
}

    if(err instanceof ZodError){
        res.status(400).json({
            status: "fail",
            message: "Validation failed",
            errors:err.flatten().fieldErrors,
        });
        return;
    }

    if(err instanceof AppError){
        res.status(err.statusCode).json({
          status:err.status,
          message:err.isOperational || process.env.NODE_ENV !== "production" ? err.message : "internal server error",
        });
        return;
    }

    if(typeof err === "object" && err!==null && "code" in err && err.code === 11000){
        res.status(409).json({
            status: "fail",
            message: "A record with this value already exists",
        });
        return;
    }

    console.error("[ERROR]",err);
    res.status(500).json({
        status: "error",
        message: process.env.NODE_ENV === "production" ? "internal server error" : err instanceof Error ? err.message : "internal server error",
    });
};

export default errorHandeler;