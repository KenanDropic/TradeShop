import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    image: {
      type: String,
      required: [true, "Please add an image"],
    },
    brand: {
      type: String,
      required: [true, "Please add a password"],
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: {
      type: mongoose.Schema.ObjectId,
      ref: "Review",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
