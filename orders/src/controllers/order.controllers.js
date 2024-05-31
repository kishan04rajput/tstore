import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { authenticateUserByAccessToken } from "../gRPC/client.js";

const createOrder = asyncHandler(async (req, res) => {
    console.log(req.body);
    // const {paymentMode, shippingAddress, billingAddress} = req.body;
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      "";
    if (!accessToken) {
      throw new ApiError(401, "UnAuthorized Access");
    }
    let userObj = null;
     
    await authenticateUserByAccessToken(accessToken).then((data)=>{
        console.log(data);
        userObj = data
    }).catch((err)=>{
        console.log("Unable to authenticate user");
    });
    
    return res
    .status(200)
    .json({})
})

export {createOrder}