import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import colors from "colors";

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Route files

// Express initialization
const app = express();

app.get("/api/v1", (req, res) => {
  res.send("API is running...");
});

// Body parser
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Starting server
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
