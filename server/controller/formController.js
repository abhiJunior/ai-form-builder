import { GoogleGenerativeAI } from '@google/generative-ai';
import {  getAuth } from '@clerk/express';
import Form from '../model/form.model.js';
import dotenv from 'dotenv';
import moment from "moment"

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const formGeneration = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const fullPrompt = `${prompt}
      \nPlease provide the form in JSON format including:
      form title, form subheading, form name, fields and label should like form_title,form_subheading with all label etc with properties like
      label, placeholder, type, required, and picture field for image upload via Cloudinary.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
    // Or 'gemini-flash-latest' if you chose that.

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
    ];

    // --- CRITICAL CHANGE: Use generateContent() instead of generateContentStream() ---
    const result = await model.generateContent({
        contents,
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const response = result.response; // Get the actual response object from the result
    const jsonResponse = response.text(); // Get the text content from the response
    // --- END CRITICAL CHANGE ---

    let formSchema;
    try {
      formSchema = JSON.parse(jsonResponse);
    } catch (parseError) {
      console.error('Failed to parse JSON response from Gemini:', parseError);
      return res.status(500).json({
        message: 'Failed to parse JSON response from AI model. Check raw response for errors.',
        rawResponse: jsonResponse,
        parseError: parseError.message
      });
    }

    res.json(formSchema);
  } catch (error) {
    console.error('Error generating form schema:', error);
    res.status(500).json({ message: 'Failed to generate form schema', error: error.message });
  }
};

export const saveForm = async (req, res) => {
  console.log("arrived at form")
  try {
    const { userId } = getAuth(req);
    const { title, schema } = req.body;
    console.log("title",title)
    console.log("schema",schema)

    if (!title || !schema) {
      return res.status(400).json({ message: 'Title and schema are required.' });
    }

    const newForm = new Form({
      userId,
      title,
      schema,           // This stores the whole Gemini JSON object
      createdAt: new Date(),
    });

    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save form', error: error.message });
  }
}

export const getForm = async(req,res)=>{
  try{
    
    const formId = req.params.id
   
    const form = await Form.findById(formId)
    
    res.status(200).json(form)
  }catch(e){
    console.log(e.message)
    res.status(500).send("message",e.message)
  }
}

export const getForms = async (req, res) => {
  console.log("going inside it or not")
  try {
    const { userId } = getAuth(req);
    console.log("getForms",userId)
    const forms = await Form.find({ userId }).sort({ createdAt: -1 });
    res.status(200).send(forms);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch forms", error: error.message });
  }
};
