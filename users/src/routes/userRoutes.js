import express from "express";
import { signup, login, deleteUser, getAllUser } from "../controllers/userController.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/createUser", signup);
router.post("/login", login);
router.delete("/:id", verifyUser, deleteUser);
router.get("/", verifyAdmin, getAllUser);

export default router;
