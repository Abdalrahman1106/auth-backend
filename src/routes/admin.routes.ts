import { Router } from "express";
import {authenticate} from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/dashboard", authenticate,  authorize("admin"),(_req, res) => {
    res.status(200).json({status: "success", message:"Welcome to the admin dashboard",});
});

export default router;