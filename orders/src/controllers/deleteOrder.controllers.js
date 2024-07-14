import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";

const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if(!order) {
      throw new ApiError(404, "Order Not Found");
    }
    if(order.userId.toString() !== req.user.id && req.user.role!==0){
      throw new ApiError(401, "You can't delete this order");
    }
    await Order.findByIdAndDelete(orderId);
    console.log("final check");
    return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Order Deleted SuccessFully")
    )
})

export {deleteOrder};