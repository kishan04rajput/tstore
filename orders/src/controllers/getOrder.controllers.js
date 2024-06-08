import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { OrderItem } from "../models/orderItem.models.js";

const getAllOrders = asyncHandler(async (req, res) => {
    const orderStatus = req.query.status || null;
    let fromDate = req.query.from || null
    let toDate = req.query.to || null

    const query = {}
    if(orderStatus) {
        query.orderStatus = orderStatus
    }
    if(fromDate && toDate) {
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        query.createdAt = { $gte: fromDate, $lte: toDate };
    }
    if(!req.user.isAdmin) {
        query.userId = req.user.id
    }

    const orders = await Order.find(query);
    
    return res
    .status(200)
    .json(
      new ApiResponse(200, {orders}, "Order Fetched SuccessFully")
    )

})

const getOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if(!order){
    throw new ApiError(404, 'Order Not Found');
  }
  if(order.userId.toString() !== req.user.id && !req.user.isAdmin){
    throw new ApiError(401, "You can't access this order");
  }
  const orderedItems = await OrderItem.find({orderId: order._id});
  return res
    .status(200)
    .json(
      new ApiResponse(200, {order, orderedItems}, "Fetch Order SuccessFully")
    )
})

export {getAllOrders, getOrder}