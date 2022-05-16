import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/error.js";

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Route files
import productRoutes from "./routes/productsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";

// Express initialization
const app = express();

// Body parser
app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("API is running...");
});

// Mount routers
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/orders", orderRoutes);

// get paypal config
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// Not Found & Error Handler middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Starting server
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
