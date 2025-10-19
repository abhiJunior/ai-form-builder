import { getAuth } from "@clerk/express"
import Submission from "../model/submission.model.js";
import Form from "../model/form.model.js";


export const submitForm = async (req, res) => {
  try {
    let userId = null;
    try {
      ({ userId } = getAuth(req)); // try get userId if logged in
    } catch (_) {
      // User not logged in, ignore error & set userId null
    }

    const { formId, data } = req.body;
    if (!formId || !data) {
      return res.status(400).json({ message: "formId and data are required" });
    }

    const submission = new Submission({
      userId,
      formId,
      data,
      createdAt: new Date(),
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit form", error: error.message });
  }
};


export const responseForm = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { formId } = req.params;

    // Ensure form belongs to user for security
    const form = await Form.findOne({ _id: formId, userId });
    if (!form) return res.status(404).json({ message: "Form not found or access denied." });

    const submissions = await Submission.find({ formId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
  }
}

export const countForm = async (req, res) => {
  const { formId } = req.params;
  const count = await Submission.countDocuments({ formId });
  res.json({ count });
}