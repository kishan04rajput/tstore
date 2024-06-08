import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String
        },
        description: {
            type: String
        },
        tags: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.model("Category", categorySchema);