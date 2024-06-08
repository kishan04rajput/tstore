import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { getProductById } from "../gRPC/client.js";
import { Order } from "../models/order.models.js";
import { OrderItem } from "../models/orderItem.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
    let {paymentMode, shippingAddress, billingAddress, productsQtys} = req.body;
    shippingAddress = new mongoose.Types.ObjectId(shippingAddress);
    billingAddress = new mongoose.Types.ObjectId(billingAddress);

    const createdOrder = await Order.create({
      paymentMode,
      shippingAddress,
      billingAddress,
      userId: new mongoose.Types.ObjectId(req.user.id)
    })
    if(!createdOrder) {
      throw new ApiError(500, "Unable to create order");
    }

    const order = await Order.findById(createdOrder._id);
    const orderedItems = [];

    for (let productQty of productsQtys) {
      let grpcProductObj = null;
      await getProductById(productQty.product)
      .then((data)=>{
        grpcProductObj = data;
      })
      .catch((err)=>{
        console.log(err);
      });
      if(grpcProductObj) {
        const orderedItem = await OrderItem.create({
          orderId: order._id,
          productId: new mongoose.Types.ObjectId(grpcProductObj._id),
          price: grpcProductObj.price,
          quantity: productQty.quantity
        })
        orderedItems.push(orderedItem);
      }
    }
       
    return res
    .status(200)
    .json(
      new ApiResponse(200, {order, orderedItems}, "Order Created SuccessFully")
    )
})

export {createOrder}