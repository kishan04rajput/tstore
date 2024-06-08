import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    unique: true,
  },
  cart: [
    {
      productID: Types.ObjectId,
      count: String,
    },
  ],
});

export default mongoose.model("cart", cartSchema);
