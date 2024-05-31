import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.use(cookieParser());

import { orderRouter } from "./routes/order.routes.js";
app.use("/", orderRouter)
export default app;
