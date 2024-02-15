import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const strictLoggedUserMiddlewares = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")
        ?.replace("Bearer", "")
    
        if(!token){
            res.status(401).json({message: "unauthorized request"})
            throw new apiError(401, "Unauthorized request")
        }
    
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")
    
        if(!user){
            res.status(401).json({message: "unauthorized request"})
            throw new apiError(401, "Unauthorized request")        
        }
    
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({message: "unauthorized request"})       
        throw new apiError(401, error?.message || "something went wrong while verifying access token")
    }
})