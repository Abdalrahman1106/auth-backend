import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import {notFound} from "./middleware/notFound.js";
import errorHandeler from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandeler);

export default app;