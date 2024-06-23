import { Router } from "express";
import { createCategory, createProduct } from "../controllers/product.controllers.js";
import { verifyJWT } from "../middlewares/authentication.middlewares.js";

const productRouter = Router();

productRouter.route("/create-product").post(verifyJWT, createProduct);
productRouter.route("/create-category").post(verifyJWT, createCategory);

export {productRouter}