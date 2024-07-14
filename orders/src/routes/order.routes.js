import { Router } from "express";
import { createOrder } from "../controllers/createOrder.controllers.js";
import { getAllOrders, getOrder } from "../controllers/getOrder.controllers.js";
import { deleteOrder } from "../controllers/deleteOrder.controllers.js";
import { deleteOrderItem } from "../controllers/deleteOrderItem.controllers.js";
import { verifyJWT } from "../middlewares/authentication.middlewares.js";



const orderRouter = Router();

orderRouter.route("/create-order").post(verifyJWT, createOrder);
orderRouter.route('/get-order/:orderId').get(verifyJWT, getOrder);
orderRouter.route("/get-all-orders").get(verifyJWT, getAllOrders);
orderRouter.route('/delete-order/:orderId').delete(verifyJWT, deleteOrder);
orderRouter.route('/delete-order-item/:orderItemId').delete(verifyJWT, deleteOrderItem);

export {orderRouter}