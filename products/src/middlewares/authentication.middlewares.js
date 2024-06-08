import { authenticateUserByAccessToken } from "../../../orders/src/gRPC/client.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
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
        req.user = userObj;
        next();
    }
    catch(err) {
        console.log(err);
        throw new ApiError(500, err?.message || "Error in verifyJWT middleware");
    }
})

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        throw next(new ApiError(403, "Forbidden: Admins only"));
    }
    next();
};

export {verifyJWT, isAdmin};