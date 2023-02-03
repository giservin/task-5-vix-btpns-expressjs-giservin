import { verifyJWT } from "../helpers/JWT.js";

export const AuthUser = async (req, res, next) => {
    if(!req.cookies.access_token) return res.status(401).json({msg: "Login first!"});

    try {
        const currentUser = await verifyJWT(req.cookies.access_token);
        req.userId = currentUser.id;
    } catch(err){
        res.status(400).json({msg: err.message});
    }

    next();
}