import express from "express";
import { WaitListModel } from "../model/waitlist.model.js";

const waitlistRouter = express.Router();

waitlistRouter.post("/wait-list/join", async function (req, res) {
  try {
    // Extract data from the request body
    const { fullName, email, make, link, occasion } = req.body;

    // Validate required fields
    if (!email  || !make || !link || !occasion) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: email,  make, link, or occasion",
      });
    }

    // Check if the email already exists
    const existingEntry = await WaitListModel.findOne({ email });
    if (existingEntry) {
      return res.status(409).json({
        status: false,
        message: "This email is already registered.",
      });
    }

    // Create a new document
    const newEntry = new WaitListModel({
      fullName,
      email,
      make,
      link,
      occasion,
    });

    // Save the document to the database
    const savedEntry = await newEntry.save();

    // Respond with status
    res.status(201).json({
      status: true,
      message: "statusfully added to the waitlist",
      data: savedEntry,
    });
  } catch (error) {
    // Handle errors
    console.error("Error saving to the waitlist:", error);

    res.status(500).json({
      status: false,
      message: "An error occurred while adding to the waitlist. Please try again.",
      error: error.message,
    });
  }
});

export default waitlistRouter;
