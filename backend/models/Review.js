import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    // veza review i user-a koji je kreirao recenziju
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    // veza review-a i proizvoda kojem pripada
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
      unique: false,
    },
  },
  { timestamps: true }
);

// dozvoli korisniku 1 recenziju po produktu
ReviewSchema.index({ user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (productID) {
  const obj = await this.aggregate([
    {
      $match: { product: productID },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Product").findByIdAndUpdate(productID, {
      averageRating: obj[0].avgRating,
    });
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.product);
});
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.product);
});
export default mongoose.model("Review", ReviewSchema);
