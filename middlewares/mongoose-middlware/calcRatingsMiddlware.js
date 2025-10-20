import productModel from "../../models/productModel.js";

const calcAvgRatingsAndQty = (schema) => {
  schema.statics.calcAverageRatingsAndQuantity = async function (
    productId
  ) {
    // stage 1: gell all reviews of this product
    const stats = await this.aggregate([
      {
        $match: { product: productId },
      },
      // stage 2: tie them on one group and calc
      {
        $group: {
          _id: "$product",
          avgRatings: { $avg: "$rating" },
          ratingsQty: { $sum: 1 }, // 1 as couter(+1) for for each document added or matched
        },
      },
    ]);

    // console.log(stats) // stats returend as array
    if (stats.length > 0) {
      await productModel.findByIdAndUpdate(productId, {
        ratingsAverage: stats[0].avgRatings,
        ratingsQuantity: stats[0].ratingsQty,
      });
    } else {
      await productModel.findByIdAndUpdate(productId, {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      });
    }
  };

  schema.post("save", async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
  });
  schema.post("findOneAndDelete", async function (doc) {
    if (doc) await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
  });
};

export default calcAvgRatingsAndQty
