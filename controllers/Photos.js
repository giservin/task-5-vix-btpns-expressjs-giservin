import { Op } from "sequelize";
import Photos from "../models/PhotoModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";

export const addPhoto = async (req,res) => {
    if(!req.file) return res.status(422).json({msg: "Image not uploaded"});
    const {title, caption} = req.body;
    // perlu mengubah path jadi posix kalau di windows:
    const photoUrl = req.file.path.split(path.sep).join(path.posix.sep);
    try {
        await Photos.create({
            title,
            caption,
            photoUrl,
            userId: req.userId
        });
        res.status(201).json({msg: "Photo added"});
    } catch(err) {
        res.status(400).json({msg: err.message})
    }
}

export const getPhotos = async (req,res) => {
    try {
        const response = await Photos.findAll({
            attributes: ['id','title', 'caption', 'photoUrl'],
            where: {
                userId: req.userId
            },
            include: [{
                model: Users,
                attributes: ['username']
            }]
        });
        if(!response) return res.status(404).json({msg: "No Photos found"})
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const getPhotoById = async (req,res) => {
    try {
        const photo = await Photos.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!photo) return res.status(404).json({msg: "Photo not found"});
        if(photo.userId !== req.userId) return res.status(403).json({msg: "Can't access others photos"});
        const response = await Photos.findOne({
            attributes: ['title', 'caption', 'photoUrl'],
            where: {
                [Op.and]: [
                    {id: photo.id},
                    {userId: req.userId}
                ]
            },
            include: [{
                model: Users,
                attributes: ['username']
            }]
        });
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const updatePhoto = async (req,res) => {
    try {
        const photo = await Photos.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!photo) return res.status(404).json({msg: "Photo not found"});

        if(photo.userId !== req.userId) return res.status(403).json({msg: "Forbidden"});
        const {title, caption} = req.body;
        await Photos.update({
            title,
            caption
        },{
            where: {
                [Op.and]: [
                    {id: photo.id},
                    {userId: req.userId}
                ]
            }
        });
        res.status(200).json({msg: "Photo Updated"});
    } catch(err) {
        res.status(500).json({msg: err.message});
    }
}

export const deletePhoto = async (req,res) => {
    try {
        const photo = await Photos.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!photo) return res.status(404).json({msg: "Photo not found"});

        if(photo.userId !== req.userId) return res.status(403).json({msg: "Forbidden"});

        fs.rm(`./${photo.photoUrl}`, {recursive: true}, (err) => {
            if(err) return res.status(500).json({msg: err.message});
        });
        await Photos.destroy({
            where: {
                [Op.and]: [
                    {id: photo.id},
                    {userId: req.userId}
                ]
            }
        });
        res.status(200).json({msg: "Delete success"});
    } catch(err) {
        res.status(500).json({msg: err.message})
    }
}