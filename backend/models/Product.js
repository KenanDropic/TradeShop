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
    averageRating: {
      type: Number,
      max: [5, "Rating must not be more than 10"],
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

// Cascade delete
ProductSchema.pre("remove", async function (next) {
  console.log(
    `Removing product means removing reviews for product: ${this._id}`
  );
  await this.model("Review").deleteMany({ product: this._id });

  next();
});

export default mongoose.model("Product", ProductSchema);
