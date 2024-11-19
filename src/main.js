import express from 'express';
import waitlistRouter from '../routes/api.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; // Import http module


dotenv.config();
const app = express();
const port = 3001;

// Create HTTP server
const server = http.createServer(app);

app.use(bodyParser.json({ limit: '50mb' })); // Increase limit to 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const dbconnectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbconnectionString)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log('Error from database connection', err);
  });

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', "https://www.astraverse.xyz","https://astra-v2.vercel.app"], // Allow frontend port
}));

app.use(bodyParser.json());

app.use(waitlistRouter);

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});