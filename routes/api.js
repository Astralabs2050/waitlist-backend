import express from "express";
import { WaitListModel } from "../model/waitlist.model.js";
import sendEmail from "../utils/sendMail.js";

const waitlistRouter = express.Router();
waitlistRouter.get('/', (req, res)=>{
res.send('working')
})
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
      message: "successfully added to the waitlist",
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

waitlistRouter.post("/test-mail",async(req,res)=>{
  try{
    console.log("req.body.mail",req.body.mail)
    //test for the mail 
    const {mail,subject,body} = req.body
    const result = await sendEmail(mail,subject,body)
    return res.json({
      status:true,
      message:"Email sent successfully",
      data:result,
    })
  }catch(error){
    return error
  }
})

waitlistRouter.get("/get-waitlist-info", async (req, res)=>{
  try {
    // Count the total number of documents in the collection
    const count = await WaitListModel.countDocuments();

    // Fetch all user information
    const users = await WaitListModel.find({}, { fullName: 1, email: 1, make: 1, link: 1, occasion: 1 });

    return  res.json({ count, users });
  } catch (error) {
    console.error("Error fetching user count and information:", error);
    throw new Error("Failed to fetch user count and information.");
  }
})

export default waitlistRouter;
