import express from "express";
import {
  signup,
  login,
  deleteUser,
  getAllUser,
  getUser,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/signUp", signup);
router.post("/login", login);
router.delete("/:id", verifyUser, deleteUser);
router.get("/", verifyAdmin, getAllUser);
router.get("/:email", verifyAdmin, getUser);
router.patch("/:id", verifyUser, changePassword);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
