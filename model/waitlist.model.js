import mongoose,{ Schema, model } from "mongoose";


const waitListSchema = new mongoose.Schema({

    fullName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },

  make: {
    type: String,
    required: true,
  },
  link:{
    type: String,
    required: true,
  },
  occasion:{
    type: String,
    required: true,
  }
}, { timestamps: true, collection: 'Waitlist' }); // Renamed the collection to "messages"


export const WaitListModel = mongoose.model('Waitlist', waitListSchema);


