import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { getUserDetail } from "../controller/userController.js";
const router = Router()

router.get("/",requireAuth(),getUserDetail)


export default router