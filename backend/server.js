import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/error.js";
import path from "path";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xss from "xss-clean";
import cors from "cors";
import { customHelmet } from "./utils/customHelmet.js";

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Route files
import productRoutes from "./routes/productsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";

// Express initialization
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());

app.use(mongoSanitize());
customHelmet(app);
app.use(xss());
app.use(hpp());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

// Mount routers
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/reviews", reviewsRoutes);
app.use("/api/v1/upload", uploadRoutes);

// get paypal config
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Set static folder,so we can go to any domain and do  /our image name and access image in browser
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// setting up production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/api/v1", (req, res) => {
    res.send("API is running...");
  });
}

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
