import express from "express";
import {
  signup,
  login,
  deleteAdmin,
  getAllAdmins,
  getAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
  createStaff,
  deleteStaff,
} from "../controllers/adminController.js";
// import { verifyUser } from "../middlewares/verifyUser.js";
// import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/signUp", signup);
router.post("/login", login);
router.delete("/:id", deleteAdmin);
router.get("/", getAllAdmins);
router.get("/:email", getAdmin);
router.patch("/:id", changePassword);
router.post("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

router.post("/staff", createStaff);
router.delete("/staff/:id", deleteStaff);

export default router;
