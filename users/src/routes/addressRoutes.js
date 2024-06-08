import express from "express";
import { verifyUser } from "../middlewares/verifyUser.js";
import {
  addAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/:id", verifyUser, addAddress);
router.delete("/:id/:addressId", verifyUser, deleteAddress);
router.put("/:id/:addressId", verifyUser, updateAddress);
router.get("/:id", verifyUser, getAddresses); //get all address of user

export default router;
