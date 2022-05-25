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
    },
  },
  { timestamps: true }
);

// dozvoli korisniku 1 recenziju po produktu
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// calc average rating for product and get total number of product reviews
ReviewSchema.statics.getAvgRatingAndNumOfReviews = async function (productID) {
  const obj = await this.aggregate([
    {
      $match: { product: productID },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $count: {} },
      },
    },
  ]);

  try {
    await this.model("Product").findByIdAndUpdate(productID, {
      averageRating: obj[0].avgRating,
      numOfReviews: obj[0].totalReviews,
    });
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", function () {
  this.constructor.getAvgRatingAndNumOfReviews(this.product);
});
ReviewSchema.pre("remove", function () {
  this.constructor.getAvgRatingAndNumOfReviews(this.product);
});
export default mongoose.model("Review", ReviewSchema);
