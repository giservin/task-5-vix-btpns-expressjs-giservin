import express from "express";
import {
    getPhotos,
    getPhotoById,
    addPhoto,
    updatePhoto,
    deletePhoto
} from "../controllers/Photos.js";
import { ImageHandler } from "../middlewares/ImageHandler.js";
import { AuthUser } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get('/photos', AuthUser, getPhotos);
router.get('/photos/:id', AuthUser, getPhotoById);
router.post('/photos', AuthUser, ImageHandler, addPhoto);
router.put('/photos/:id', AuthUser, updatePhoto);
router.delete('/photos/:id', AuthUser, deletePhoto);

export default router;