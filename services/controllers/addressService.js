import expressAsyncHandler from "express-async-handler";
import userModel from "../../models/userModel.js";

// @dec     Add address
// @route   POST api/v1/addresses
// @access  Private / logged user
const addAddress = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address added successfully.",
    data: user.addresses,
  });
});

// @dec     Remove specific address
// @route   DELETE api/v1/addresses/:id
// @access  Private / logged user
const removeAddress = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: {_id: req.params.addressId} },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address removed successfully.",
    data: user.addresses,
  });
});

// @dec     Update specific address
// @route   PUT api/v1/addresses/:id
// @access  Private / logged user
const updateAddress = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    {
    _id: req.user._id,
    "addresses._id": req.params.addressId
    },
    {
      "addresses.$": req.body 
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Address updated successfully.",
    data: user.addresses,
  });
});

// @dec     Get all addresses
// @route   GET api/v1/addresses
// @access  Private / logged user
const getAddresses = expressAsyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  res.status(200).json({
    status: "Success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

export {
  addAddress,
  removeAddress,
  updateAddress,
  getAddresses,
};
