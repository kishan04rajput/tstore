import express from "express";
import "dotenv/config";
import { connect } from "./db/Connect.js";
import userRoute from "./routes/userRoutes.js";
import CookieParser from "cookie-parser";
import grpcSever from "./gRPC/server.js"

const app = express();

app.use(express.json());
app.use(CookieParser());
app.use("/", userRoute);

app.listen(process.env.PORT || 8003, () => {
  connect();
  grpcSever();
  console.log(`Server started at port ${process.env.PORT}`);
});
