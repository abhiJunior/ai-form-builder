import Router from "express"
import { submitForm,responseForm} from "../controller/submission.Controller.js"
import { requireAuth } from "@clerk/express"
import { countForm } from "../controller/submission.Controller.js"
const router = Router() 


router.post("/",submitForm)
router.get("/:formId",requireAuth(),responseForm)
router.get("/count/:formId",requireAuth(),countForm)

export default router