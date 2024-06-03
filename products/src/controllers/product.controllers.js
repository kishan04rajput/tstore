import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { authenticateUserByAccessToken } from "../gRPC/client.js";


const createProduct = asyncHandler(async (req, res) => {
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
    const {title, category, description, price, stock} = req.body
    const createdProduct = await Product.create({
        createdBy: new mongoose.Types.ObjectId(userObj.id),
        title,
        category,
        description,
        price,
        stock
    })
    if (!createdProduct) {
        return new ApiError(500, "Unable to create Product");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {createdProduct}, "Category Created Successfully")
    );

});

const createCategory = asyncHandler(async (req, res) => {
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
    const {name, description, tags} = req.body

    const createdCategory = await Category.create({
        createdBy: new mongoose.Types.ObjectId(userObj.id),
        name: name,
        description: description || '',
        tags: tags || ''
    })

    if(!createdCategory) {
        return new ApiError(500, "Unable to create category");
    }

    const category = await Category.findById(createdCategory._id);
    return res
    .status(200)
    .json(
        new ApiResponse(200, {category}, "Category Created Successfully")
    );
    
});

export {createProduct, createCategory};