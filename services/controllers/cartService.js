import expressAsyncHandler from "express-async-handler";
import productModel from "../../models/productModel.js";
import cartModel from "../../models/cartModel.js";
import couponModel from "../../models/couponModel.js";
import ApiError from "../../utils/apiError.js"


// @des     Add product to cart
// @route   POST /api/v1/cart
// @access  Private / logged user
const addProductToCart = expressAsyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await productModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });

  // Creating Cart
  if (!cart) {
    cart = await cartModel.create({
      cartItems: [{ product: productId, price: product.price, color }],
      user: req.user._id,
    });
  } else {
    const produtIndex = cart.cartItems.findIndex((item)=> item.product == productId && item.color === color)
    if(produtIndex > -1) cart.cartItems[produtIndex].quantity += 1
    else cart.cartItems.push({ product: productId, price: product.price, color })
  }
//   calcTotalCartPrice(cart)
  await cart.save()
  res.status(200).json({
    status: 'Success',
    message: 'Product added to cart successfully.',
    numOfCartItems: cart.cartItems.length,
    data: cart
  })
});

// @des     Get cart
// @route   GET /api/v1/cart
// @access  Private / logged user
const getCart = expressAsyncHandler(async(req, res, next)=> {
    const cart = await cartModel.findOne({ user: req.user._id });
    if(!cart) return next(new ApiError(`No cart for this user id: ${req.user._id}`), 404)

    res.status(200).send({
        status: 'Success',
        numOfCartItems: cart.cartItems.length,
        data: cart 
    })
})

// @des     Update the quantity of specific cart product
// @route   UPDATE /api/v1/cart
// @access  Private / logged user
const updateSpecificProductQty = expressAsyncHandler(async(req, res, next)=> {
    const cart = await cartModel.findOneAndUpdate( //get all cart of the user Not certain item
        { 
          user: req.user._id,
          "cartItems.product": req.params.id
        },
        {"cartItems.$.quantity": req.body.quantity},
        {new: true}
     );
     
    if(!cart) return next(new ApiError(`No product  in the cart for this id: ${req.params.id}`), 404)
    await cart.save() // trigger calcTotal

    res.status(200).json({
        status: 'Success',
        numOfCartItems: cart.cartItems.length,
        data: cart 
    })
})

// @des     Remove specific product from cart
// @route   DELETE /api/v1/cart/:id
// @access  Private / logged user
const removeSpecificProduct = expressAsyncHandler(async(req, res, next)=> {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id}, { $pull : {cartItems: {_id: req.params.id}}}, {new: true})
    await cart.save() // trigger calcTotal

    res.status(200).json({
        status: 'Success',
        numOfCartItems: cart.cartItems.length,
        data: cart 
    })
})

// @des     Clear cart
// @route   DELETE /api/v1/cart
// @access  Private / logged user
const clearCart = expressAsyncHandler(async(req, res, next)=> {
    const cart = await cartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).send()
})

// @des     Apply coupon on cart
// @route   PUT /api/v1/cart
// @access  Private / logged user
const applyCouponOnCart = expressAsyncHandler(async(req, res, next)=> {
  const coupon = await couponModel.findOne({name: req.body.coupon, expire: {$gt: Date.now()}})
  if(!coupon) return next(new ApiError('Invalid or expired coupon.', 404))

  let cart = await cartModel.findOne({user: req.user._id})
  if(!cart) return next(new ApiError(`No cart for this user id: ${req.user._id}`, 404))

  const priceDiscount = (cart.totalCartPrice - (cart.totalCartPrice * coupon.discount)/100).toFixed(2)
  cart = await cartModel.findOneAndUpdate({user: req.user._id}, {totalCartPriceAfterDiscount: priceDiscount}, {new: true})

   res.status(200).json({
    status: 'Success',
    message: 'Coupon applied on cart successfully.',
    numOfCartItems: cart.cartItems.length,
    data: cart
  })
})

export {
    addProductToCart,
    getCart,
    updateSpecificProductQty,
    removeSpecificProduct,
    clearCart,
    applyCouponOnCart
}


