export const logout = (req, res) => {
    try {  
        res
        .clearCookie("access_token")
        .status(200)
        .json({ msg: "Successfully logged out" });
    } catch(err) {
        res.status(400).json({msg: err.message});
    }
}