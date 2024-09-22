const jwt=require("jsonwebtoken")
require("dotenv").config();
const User=require('../models/User')

exports.auth=async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;

        let token=req.body.token || authHeader.split(' ')[1]
        console.log("token ->",token)

        if(!token || token === undefined){
            return res.status(401).json({
                success:false,
                message:"token is missing",
            });
        }

        try {
            const decode=jwt.verify(token, process.env.JWT_SECRET)
            console.log("decode->",decode)
            const user = await User.findOne({ _id: decode.id });
            req.user = user;

        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}