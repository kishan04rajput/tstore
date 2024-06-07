import mongoose, { Schema } from "mongoose";
import { Order } from "./order.models.js";
const orderItemSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

orderItemSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
