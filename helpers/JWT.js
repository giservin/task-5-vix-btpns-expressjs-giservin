import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_secret = process.env.JWT_SECRET;

export const signJWT = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign({
            id: user.id,
            email: user.email
        }, JWT_secret, 
        (err, token) => {
            if(err) reject(err)
            resolve(token)
        })
    });
}

export const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_secret, (err, verified) => {
            if(err) reject({message: "Invalid Token"})
            resolve(verified)
        })
    });
}