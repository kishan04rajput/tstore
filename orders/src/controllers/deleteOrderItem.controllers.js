import mongoose, { Schema } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OrderItem } from "../models/orderItem.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authenticateUserByAccessToken } from "../gRPC/client.js";

const deleteOrderItem = asyncHandler(async (req, res) => {
  const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      "";
    if (!accessToken) {
      throw new ApiError(401, "UnAuthorized Access");
    }
     
    const userObj = await authenticateUserByAccessToken(accessToken).catch((err)=>{
        throw new ApiError(401, "Unable to authenticate user");
    });

    if(!userObj) {
      throw new ApiError(401, "invalid access token");
    }
    const { orderItemId } = req.params;
    await OrderItem.findByIdAndDelete(orderItemId);
    return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Order Item Deleted SuccessFully")
    )
})

export {deleteOrderItem}