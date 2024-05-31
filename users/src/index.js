import express from "express";
import "dotenv/config";
import { connect } from "./db/Connect.js";
import userRoute from "./routes/userRoutes.js";
import CookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(CookieParser());
app.use("/", userRoute);

app.listen(process.env.PORT, () => {
  connect();
  console.log(`Server started at port ${process.env.PORT}`);
});
