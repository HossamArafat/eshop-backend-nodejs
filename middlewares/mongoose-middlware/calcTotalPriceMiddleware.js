const calcTotalCartPrice = (schema) => {
  const calcPrice = (doc) => {
    let totalPrice = 0;
    doc.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    doc.totalCartPrice = totalPrice;
    doc.totalCartPriceAfterDiscount = undefined;
  };

  schema.pre("save", function (next) {
    calcPrice(this);
    next();
  });
};

export default calcTotalCartPrice;
