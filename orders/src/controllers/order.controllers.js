import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { authenticateUserByAccessToken } from "../gRPC/client.js";
import { Order } from "../models/order.models.js";
import { OrderItem } from "../models/orderItem.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
    let {paymentMode, shippingAddress, billingAddress, productsQtys} = req.body;
    shippingAddress = new mongoose.Types.ObjectId(shippingAddress);
    billingAddress = new mongoose.Types.ObjectId(billingAddress);
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      "";
    if (!accessToken) {
      throw new ApiError(401, "UnAuthorized Access");
    }
     
    const userObj = await authenticateUserByAccessToken(accessToken).catch((err)=>{
        return new ApiError(401, "Unable to authenticate user");
    });

    if(!userObj) {
      return new ApiError(401, "invalid access token");
    }

    const createdOrder = await Order.create({
      paymentMode,
      shippingAddress,
      billingAddress,
      userId: new mongoose.Types.ObjectId(userObj.id)
    })
    if(!createdOrder) {
      return new ApiError(500, "Unable to create order");
    }

    const order = await Order.findById(createdOrder._id);
    const orderedItems = [];

    for (let productQty of productsQtys) {
      const orderedItem = await OrderItem.create({
        orderId: order._id,
        productId: new mongoose.Types.ObjectId(productQty.product),
        price: 100,
        quantity: productQty.quantity
      })
      orderedItems.push(orderedItem);
    }
       
    return res
    .status(200)
    .json(
      new ApiResponse(200, {order, orderedItems}, "Order Created SuccessFully")
    )
})

export {createOrder}