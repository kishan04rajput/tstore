import mongoose, { Schema } from "mongoose";
import { CREATED, ORDER_STATUS_ENUM } from "../constants";

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        paymentMode: {
            type: String,
            required: true
        },
        deliveryDate: {
            type: Date,
            required: false,
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ORDER_STATUS_ENUM,
            default: CREATED
        },
        shippingAddress: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        },
        billingAddress: {
            type: Schema.Types.ObjectId,
            ref: 'Address',
        }

    },
    {
        timestamps: true
    }

)

export const Order = mongoose.model("Order", orderSchema)