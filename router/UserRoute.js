import express from "express";
import { loginUser, registerUser, updateUser, deleteUser } from "../controllers/Users.js";
import { logout } from "../controllers/Auth.js";
import { AuthUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get('/users/login', loginUser);
router.post('/users/register', registerUser);
router.put('/users/:id', AuthUser, updateUser);
router.delete('/users/:id', AuthUser, deleteUser);
router.delete('/logout', AuthUser, logout);

export default router;