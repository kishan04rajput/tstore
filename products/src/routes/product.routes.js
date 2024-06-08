import { Router } from "express";
import { createCategory, createProduct } from "../controllers/product.controllers.js";

const productRouter = Router();

productRouter.route("/create-product").post(createProduct);
productRouter.route("/create-category").post(createCategory);

export {productRouter}