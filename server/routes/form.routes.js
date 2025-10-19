import { Router } from "express";
import { requireAuth } from '@clerk/express';
import { formGeneration,saveForm,getForm,getForms } from "../controller/formController.js";



const router = Router()
router.get("/:id",getForm)
router.get("/",requireAuth(),getForms)
router.post("/generate",formGeneration)
router.post("/save",requireAuth(),saveForm)



export default router