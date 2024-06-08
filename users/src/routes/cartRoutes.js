import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import { add2Cart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/:id", verifyUser, add2Cart); //userID

export default router;
