import expressAsyncHandler from "express-async-handler";
import userModel from "../../models/userModel.js";

// @dec     Add product to the liked Products
// @route   POST api/v1/wishlist
// @access  Private / logged user
const addProductToWishlist = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      //$ addToSet: { likedProducts: req.body.productId },
      $push: { likedProducts: {$each: [req.body.productId], $position: 0} }, //each, position for sorting
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product added to your wishlist successfully.",
    data: user.likedProducts,
  });
});

// @dec     Remove product from the liked Products
// @route   DELETE api/v1/wishlist
// @access  Private / logged user
const removeProductFromWishlist = expressAsyncHandler(
  async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { likedProducts: req.params.productId },
      },
      { new: true }
    );

    res.status(200).json({
      status: "Success",
      message: "Product removed from your wishlist successfully.",
      data: user.likedProducts,
    });
  }
);

// @dec     Get product from the liked Products
// @route   GET api/v1/wishlist
// @access  Private / logged user
const getProductsFromWishlist = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate('likedProducts');

  res.status(200).json({
    status: "Success",
    results: user.likedProducts.length,
    data: user.likedProducts,
  });
});

export {
  addProductToWishlist,
  removeProductFromWishlist,
  getProductsFromWishlist,
};
