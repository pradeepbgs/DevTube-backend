import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import videoModel from "../models/video.model";
import { apiResponce } from "../utils/apiResponce";

const videoUpload = asyncHandler(async (req, res, next) => {
    // get the title, description, tags, thumbnail from the request body
    // get the user from req.user
    // check if the user is authenticated 
    // create a new video object with the title, description, tags, thumbnail, user
    // save the video object to the database
    // return the video object
    // res.status

    const user = req.user;
    const { title, description } = req.body
    const {videoFile} = req.files?.video[0]?.path;
    const {thumbnail} = req.files?.thumbnail[0]?.path;
    
    try {

        if(!user) return res.status(401).json(new apiError(401, "user not found"))
        if(
            [title,description,thumbnail].some((field) => field?.trim() === "")
           ){
                throw new apiError("All field are required", 400)
           }

           if(!videoFile) throw new apiError("video file is required")

           const video = await uploadOnCloudinary(videoFile)
           if(!video) throw new apiError("video upload failed")
           const thumbnailUrl = await uploadOnCloudinary(thumbnail)
           if(!thumbnail) throw new apiError('thumbnail upload failed')

           const user = req.user;
           if(!user) throw new apiError('user not found')

           const uploadedVideo = await videoModel.create({
            title,
            description,
            videoFile: video.url | "",
            thumbnail: thumbnailUrl.url | "",
            owner: user._id,
         })

         return res
         .status(201)
         .json(
            new apiResponce(
                201,
                uploadedVideo,
                "video uploaded successfully"
            )
         )

    } catch (error) {
        console.log("error in video.controller.js on videoupload controller")
        return res
        .status(500)
        .json(
            new apiError(401, error.message | "error while uploading video")
        )
    }
    
})



export {
    videoUpload,
}