import express from "express";
import "dotenv/config";
import { connect } from "./db/Connect.js";
import userRoute from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import staffRoute from "./routes/staffRoutes.js";
import CookieParser from "cookie-parser";
import grpcSever from "./gRPC/server.js";
import addressRoute from "./routes/addressRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    credentials: true, // Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(CookieParser());
app.use("/address", addressRoute);
app.use("/add2Cart", cartRoutes);
app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/staff", staffRoute);

app.listen(process.env.PORT || 8003, () => {
  connect();
  grpcSever();
  console.log(`Server started at port ${process.env.PORT}`);
});
