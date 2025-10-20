import {config} from "dotenv";
config({ path: "config.env" });
import expressAsyncHandler from "express-async-handler";
import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";
import settingModel from "../../models/settingModel.js";
import ApiError from "../../utils/apiError.js";
import orderModel from "../../models/orderModel.js";
import { getAll, getOne } from "../handlerFactory.js";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Get cart and set price
const setBeforeOrder = async (userId, next) => {
  const cart = await cartModel.findOne({ user: userId });
  if (!cart)
    return next(new ApiError(`No cart for this user id: ${userId}`, 404));

  const { taxPrice, shippingPrice } = (await settingModel.findOne({})) || {
    taxPrice: 0,
    shippingPrice: 0,
  };
  const totalCartPrice =
    cart.totalCartPriceAfterDiscount ?? cart.totalCartPrice;
  const totalOrderPrice = totalCartPrice + taxPrice + shippingPrice;

  return { cart, totalCartPrice, taxPrice, shippingPrice, totalOrderPrice };
};

// Decrese quantity, increase sold, delete cart
const setAfterOrder = async (order, cart, userId) => {
    if (order) {
    const bulkArray = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkArray);
    await cartModel.deleteOne({ user: userId });
  }
};

// @des     Create cash order
// @route   POST /api/v1/orders
// @access  Private / logged user
const createCashOrder = expressAsyncHandler(async (req, res, next) => {
  // Get data and set price
  const userId = req.user._id
  const data = await setBeforeOrder(userId, next);
  const { cart, totalCartPrice,  taxPrice, shippingPrice, totalOrderPrice } = data

  // Create order
  const order = await orderModel.create({
    user: userId,
    cartItems: cart.cartItems,
    cartPrice: totalCartPrice,
    taxPrice,
    shippingPrice,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // After creating order
  await setAfterOrder(order, cart, userId)

  res.status(200).json({
    status: "Success",
    message: "Cash order created successfully.",
    data: order,
  });
});

// @des     Get all orders of only logged users or other users
// @route   GET /api/v1/orders
// @access  Private / logged user-admin-manager
const getOrders = getAll(orderModel);

// @des     Get specific order of only logged user or other users
// @route   GET /api/v1/orders/:id
// @access  Private / logged user-admin-manager
const getspecificOrder = getOne(orderModel);

// @des     Update status order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private / admin-manger
const updateOrderToPaid = expressAsyncHandler(async (req, res, next) => {
  const order = await orderModel.findOneAndUpdate(
    { _id: req.params.id },
    { isPaid: true, paidAt: Date.now() },
    { new: true }
  );
  if (!order)
    return next(new ApiError(`No order for this id: ${req.params.id}`, 404));

  res.status(200).json({
    status: "Success",
    message: "Status order updated to paid successfully.",
    data: order,
  });
});

// @des     Update status order to paid
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private / admin-manger
const updateOrderToDelivered = expressAsyncHandler(async (req, res, next) => {
  const order = await orderModel.findOneAndUpdate(
    { _id: req.params.id },
    { isDelivered: true, deliveredAt: Date.now() },
    { new: true }
  );
  if (!order)
    return next(new ApiError(`No order for this id: ${req.params.id}`, 404));

  res.status(200).json({
    status: "Success",
    message: "Status order updated to delivered successfully.",
    data: order,
  });
});

// @des     Create checkout session from stripe then user get it
// @route   GET /api/v1/orders/checkout-session
// @access  Private / logged user
const createCheckoutSession = expressAsyncHandler(async(req, res, next)=> {
  // Get data (id, price)
  const userId = String(req.user._id)
  const { totalOrderPrice } = await setBeforeOrder(userId, next);
  // Create session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        } ,
        quantity: 1,     
      },
    ],
    success_url: `${req.protocol}://${req.headers['host']}/orders`,
    cancel_url: `${req.protocol}://${req.headers['host']}/carts`,
    
    client_reference_id: userId,
    metadata: req.body.shippingAddress, 
  })

  res.status(200).json({status: 'Success', session})
})

// Create order if payment process completed in webhook
const createCardOrder = async(session, res, next) => {
  // get data
  const userId = session.client_reference_id
  const shippingAddress = session.metadata
  console.log("debug2: ", session.metadata)

  const orderPrice = session.amount_total / 100
  const { cart, totalCartPrice, taxPrice, shippingPrice } = await setBeforeOrder(userId, next)

  // Create order
  const order = await orderModel.create({
    user: userId,
    cartItems: cart.cartItems,
    cartPrice: totalCartPrice,
    taxPrice,
    shippingPrice,
    totalOrderPrice: orderPrice,
    shippingAddress,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: 'card'
  });

  // After creating order
  await setAfterOrder(order, cart, userId)

   res.status(200).send({received: true})
}

// @des     This webhook will run when stripe payment paid
// @route   PUT /api/v1/orders/checkout-webhook
// @access  Private / logged user
const checkoutWebhook = expressAsyncHandler( async(req, res, next)=> {
  const sig = req.headers['stripe-signature']
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    )
    if (event.type == 'checkout.session.completed')
      await createCardOrder(event.data.object, res, next)
  } catch(err) {
    console.log(err.message)
    return res.status(400).json({ webhook_error: err.message })
  }
})


export {
  createCashOrder,
  getOrders,
  getspecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  createCheckoutSession,
  checkoutWebhook,
};
