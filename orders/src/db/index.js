import mongoose from "mongoose";
import { ORDERS_DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        console.log(`${process.env.ORDERS_MONGODB_URI}/${ORDERS_DB_NAME}`);
        await mongoose.connect(
            `${process.env.ORDERS_MONGODB_URI}/${ORDERS_DB_NAME}`
        );
    } catch (error) {
        console.error("Mongo DB Connection Error", error);
        process.exit(1);
    }
};

export default connectDB;
