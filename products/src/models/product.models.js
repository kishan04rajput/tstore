import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },
        productURL: {
            type: String,
        },
        description: {
            type: String,
        },
        discountType: {
            type: String
        },
        discountValue: {
            type: Number
        },
        tags: {
            type: String
        },
        slug: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema);
