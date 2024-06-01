import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

//express settings
app.use(express.json({
    limit: "16kb",
}));
app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}));

app.use(cookieParser());

import { orderRouter } from "./routes/order.routes.js";
app.use("/", orderRouter)

export default app;
