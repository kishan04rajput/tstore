import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authenticateUserByAccessToken } from "../gRPC/client.js";
import { Order } from "../models/order.models.js";

const editOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const updateData = req.body;
})