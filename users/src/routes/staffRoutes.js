import express from "express";
import {
  signup,
  login,
  deleteStaff,
  getAllStaff,
  getStaff,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/staffController.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/signUp", signup);
router.post("/login", login);
// router.delete("/:id", deleteStaff);
router.get("/", getAllStaff);
router.get("/:email", getStaff);
router.patch("/:id", verifyUser, changePassword);
router.post("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
