export class AppError extends Error{
    public readonly statusCode: number;
    public readonly status: "fail" | "error";
    public readonly isOperational: boolean;


constructor(message:string, statusCode:number, isOperational = true,){
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = statusCode >= 5000 ? "error" : "fail";
    this.isOperational = isOperational;

    Error.captureStackTrace(this,this.constructor);
}
}