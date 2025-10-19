import express from "express"
import dotenv from "dotenv"
import submissionRouter from "./routes/submission.routes.js"

import connectToDB from "./config/dbConfig.js"
import {clerkMiddleware} from "@clerk/express"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import formRouter from "./routes/form.routes.js"

dotenv.config()

const app = express()

app.use(clerkMiddleware())

const corsOptions = {
  origin: 'http://localhost:5173', // your React app URL
  credentials: true,               // allow cookies and Clerk tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));




app.use(express.json())

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function listModelsViaHttp() {
//   try {
//     console.log("Attempting to list available models via direct HTTP call...");
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       console.error("API_KEY is not set in your .env file!");
//       return;
//     }

//     const response = await axios.get(
//       `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
//     );

//     const models = response.data.models;

//     console.log("--- Available Models for your API Key (Direct HTTP) ---");
//     if (!models || models.length === 0) {
//       console.log("No models found via direct HTTP call. This is highly unusual and suggests an API key or project misconfiguration.");
//     } else {
//       for (const model of models) {
//         console.log(`Name: ${model.name}`);
//         console.log(`  Description: ${model.description}`);
//         console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
//         console.log("---");
//       }
//     }
//     console.log("--- End of Available Models Check (Direct HTTP) ---");
//   } catch (error) {
//     console.error("Error listing models via direct HTTP:", error);
//     if (error.response) {
//       console.error("HTTP Status:", error.response.status);
//       console.error("HTTP Response Data:", error.response.data);
//     }
//     console.error("Please ensure your API key is correct and has access to the Generative Language API.");
//   }
// }

// listModelsViaHttp(); // Call this function instead of listAvailableModels


// export const formGeneration = async (req, res) => {
//   // ... your formGeneration code remains the same,
//   // but you'll use a model name from the listModelsViaHttp output.
//   // For example, if it lists "models/gemini-1.5-flash", you'd use 'gemini-1.5-flash'
//   // for the model: genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   try {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

//     const fullPrompt = `${prompt}
//       \nPlease provide the form in JSON format including:
//       form title, form subheading, form name, fields with properties like
//       label, placeholder, type, required, and picture field for image upload via Cloudinary.`;

//     // **IMPORTANT:** Once you get the list of models from `listModelsViaHttp`,
//     // use one of the *full model names* returned here.
//     // Example: If it lists "models/gemini-1.0-pro", use 'gemini-1.0-pro'
//     // If it lists "models/gemini-1.5-flash", use 'gemini-1.5-flash'
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Placeholder for now

//     const contents = [
//       {
//         role: 'user',
//         parts: [
//           {
//             text: fullPrompt,
//           },
//         ],
//       },
//     ];

//     const response = await model.generateContentStream({
//         contents,
//         generationConfig: {
//             responseMimeType: "application/json"
//         }
//     });

//     let jsonResponse = '';

//     for await (const chunk of response) {
//       if (chunk.candidates && chunk.candidates[0].content && chunk.candidates[0].content.parts) {
//         jsonResponse += chunk.candidates[0].content.parts[0].text || '';
//       }
//     }

//     let formSchema;
//     try {
//       formSchema = JSON.parse(jsonResponse);
//     } catch (parseError) {
//       console.error('Failed to parse JSON response from Gemini:', parseError);
//       return res.status(500).json({
//         message: 'Failed to parse JSON response from AI model. Check raw response for errors.',
//         rawResponse: jsonResponse,
//         parseError: parseError.message
//       });
//     }

//     res.json(formSchema);
//   } catch (error) {
//     console.error('Error generating form schema:', error);
//     res.status(500).json({ message: 'Failed to generate form schema', error: error.message });
//   }
// };

app.use("/api/user",userRouter)
app.use("/api/form",formRouter)
app.use("/api/submission",submissionRouter)

app.get("*",(req , res)=>{
  res.send("server not found")
})

app.listen(5000,async()=>{
    await connectToDB()
    console.log("Server running at http://localhost:5000")
})