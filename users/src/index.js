import express from "express";
import "dotenv/config";
import { connect } from "./db/Connect.js";
import userRoute from "./routes/userRoutes.js";
import CookieParser from "cookie-parser";
import grpcSever from "./gRPC/server.js";
import addressRoute from "./routes/addressRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

app.use(express.json());
app.use(CookieParser());
app.use("/address", addressRoute);
app.use("/add2Cart", cartRoutes);
app.use("/", userRoute);

app.listen(process.env.PORT, () => {
  connect();
  grpcSever();
  console.log(`Server started at port ${process.env.PORT}`);
});
