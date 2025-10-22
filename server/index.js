import express from "express"
import dotenv from "dotenv"
import submissionRouter from "./routes/submission.routes.js"
import connectToDB from "./config/dbConfig.js"
import { clerkMiddleware } from "@clerk/express"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import formRouter from "./routes/form.routes.js"

dotenv.config()

const app = express()



const corsOptions = {
  origin: [
    'http://localhost:5173',                      // Local development
    'https://ai-form-builder-unb4.onrender.com'   // Render frontend deployment (update if custom domain)
  ],
  credentials: true,               // Allow cookies/Clerk tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization',"Cookie","Clerk-Token"],
}

app.use(cors(corsOptions))

app.options('*', cors(corsOptions))

app.use(clerkMiddleware())

app.use(express.json())

// Mount routes
app.use("/api/user", userRouter)
app.use("/api/form", formRouter)
app.use("/api/submission", submissionRouter)

// 404 fallback for unmatched routes
app.get("*", (req, res) => {
  res.send("server not found")
})
const port = process.env.PORT || 5000
app.listen(port, async () => {
  await connectToDB()
  console.log(`Server running at http://localhost:${port}`)
})
