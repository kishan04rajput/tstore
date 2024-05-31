import mongoose, { Schema } from "mongoose";
import { CREATED, ORDER_STATUS_ENUM } from "../constants";

const OrderSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        payment_mode: {
            type: String,
            required: true
        },
        delivery_date: {
            type: Date,
            required: false,
        },
        order_status: {
            type: String,
            required: true,
            enum: ORDER_STATUS_ENUM,
            default: CREATED
        },
        shipping_address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },
        billing_address: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        }

    }
)

export const Order = mongoose.model("Order", OrderSchema)