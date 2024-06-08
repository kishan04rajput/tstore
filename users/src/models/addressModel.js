import mongoose, { Types } from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    unique: true,
  },
  address: [
    {
      address: String,
      landMark: String,
      state: String,
      city: String,
      pincode: String,
    },
  ],
});

export default mongoose.model("address", addressSchema);
