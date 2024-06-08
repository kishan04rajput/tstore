import cartModel from "../models/cartModel.js";

export const add2Cart = async (req, res) => {
  const { cart } = req.body;
  // console.log("cart\n", cart);
  try {
    const presentCart = await cartModel.findOne({ userId: req.params.id });
    if (!presentCart) {
      const newCart = new cartModel({
        userId: req.params.id,
        cart: cart,
      });
      await newCart.save();
      res.status(200).send("cart created with item!");
    } else {
      const productIndex = presentCart.cart.findIndex(
        (item) => item.productID.toString() === cart.productID
      );

      if (productIndex !== -1) {
        if (cart.count === "0") {
          // If the count is 0, remove the product from the cart
          presentCart.cart.splice(productIndex, 1);
          await presentCart.save();
          return res.status(200).send("Product removed from cart!");
        } else {
          // If the product exists, update its count
          presentCart.cart[productIndex].count = cart.count;
          await presentCart.save();
          return res.status(200).send("Product count updated in cart!");
        }
      } else {
        // If the product is not in the cart, add it to the cart array
        presentCart.cart.push(cart);
        await presentCart.save();
        return res.status(200).send("Product added to cart!");
      }
    }
  } catch (err) {
    console.log("err\n", err);
    res.status(400).send("err");
  }
};
