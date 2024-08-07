import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { authenticateUserByAccessToken } from "../gRPC/client.js";


const createProduct = asyncHandler(async (req, res) => {
  const { title, category, description, price, stock } = req.body;
  const createdProduct = await Product.create({
    createdBy: new mongoose.Types.ObjectId(req.user.id),
    title,
    category,
    description,
    price,
    stock,
  });
  if (!createdProduct) {
    throw new ApiError(500, "Unable to create Product");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { createdProduct }, "Category Created Successfully"),
    );

});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, tags } = req.body;

  const createdCategory = await Category.create({
    createdBy: new mongoose.Types.ObjectId(req.user.id),
    name: name,
    description: description || "",
    tags: tags || "",
  });

  if (!createdCategory) {
    throw new ApiError(500, "Unable to create category");
  }

  const category = await Category.findById(createdCategory._id);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { category }, "Category Created Successfully"),
    );

});

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const products = await Product.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  const totalDocuments = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);
  return res
    .status(200)
    .json(new ApiResponse(200, { products, totalPages, page, limit }, "Product Fetched"));
});

export { createProduct, createCategory, getProducts };