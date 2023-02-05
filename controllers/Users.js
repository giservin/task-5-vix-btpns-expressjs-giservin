import Users from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { signJWT } from "../helpers/JWT.js";
import fs from "fs";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    console.log(username, email, password);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({msg: "Success Registering"});
    } 
    catch(err) {
        res.status(400).json({msg: err.message})
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({
            where: {
                email
            }
        });
        if(!user) return res.status(404).json({msg: "User not found!"});
        
        const verifyPassword = await bcrypt.compare(password, user.password);
        if(!verifyPassword) return res.status(400).json({msg: "Wrong Password"});
        
        const userJWT = await signJWT(user);
        res.cookie("access_token", userJWT, {
            httpOnly: true
        }).status(200).json({msg: "Login Success!"});
    }
    catch(err) {
        res.status(400).json({msg: err.message});
    }
}

export const updateUser = async (req, res) => {
    try {
        if(req.params.id != req.userId) return res.status(403).json({msg: "Forbidden"});
        const user = await Users.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "No user found"});
        const {username, email, password} = req.body;
        let hashedPassword = "";
        if(password === null || password === "") {
            hashedPassword = user.password;
        } else {
            hashedPassword = await bcrypt.hash(password, 10)
        }
        await Users.update({
            username,
            email,
            password : hashedPassword
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({msg: "User Updated"});
    }
    catch(err) {
        res.status(400).json({msg: err.message})
    }
}

export const deleteUser = async (req, res) => {
    try {
        if(req.params.id != req.userId) return res.status(403).json({msg: "Forbidden"});
        const user = await Users.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!user) return res.status(404).json({msg: "User not found"});
        // deleting all the user's photos.
        fs.rm(`./tmp/${user.email}`, {recursive: true, force: true}, (err) => {
            if(err) return res.status(500).json({msg: err.message});
        })
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.clearCookie("access_token").status(200).json({msg: "User deleted"});
    }
    catch(err) {
        res.status(400).json({msg: err.message});
    }
}