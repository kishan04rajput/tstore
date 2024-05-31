import { Router } from "express";
import { createOrder } from "../controllers/order.controllers.js";

const orderRouter = Router();

orderRouter.route("/create-order").post(createOrder);

export {orderRouter}