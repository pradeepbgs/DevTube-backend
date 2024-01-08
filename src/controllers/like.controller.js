import mongoose, {isValidObjectId} from "mongoose"
import Like from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"




const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
    if(!videoId || !isValidObjectId(videoId)){
        throw new apiError(400,"Invalid video id")
    }
    const authenticatedId = req.user;
    const tweeted = await Like.create({
        video: videoId,
        likedBy: authenticatedId?._id
    })
    
    if(!tweeted){
        throw new apiError(400,"Unable to like video")
    }

    return res
    .status(200)
    .json(apiResponse(200, "Like toggled"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId || !isValidObjectId(commentId)){
        throw new apiError(400,"Invalid comment  id")
    }
    const authenticatedId = req.user;
    if(!authenticatedId){
        throw new apiError(400,"Unable to like comment")
    }
    const likedComment = await Like.create({
        Comment: commentId,
        likedBy: authenticatedId?._id
    })
    
    if(!likedComment){
        throw new apiError(400,"Unable to like comment")
    }

    return res
    .status(200)
    .json(apiResponse(200, "liked comment"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId || !isValidObjectId(tweetId)){
        throw new apiError(400,"Invalid tweet id")
    }

    const authenticatedId = req.user;
    if(!authenticatedId){
        throw new apiError(400,"Unable to like tweet")
    }

    const likedTweet = await Like.create({
        tweet: tweetId,
        likedBy: authenticatedId?._id
    })
    
    if(!likedTweet){
        throw new apiError(400,"Unable to like tweet")
    }

    return res
    .status(200)
    .json(apiResponse(200, "liked tweet"))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const authenticatedId = req.user;
    if(!authenticatedId){
        throw new apiError(400,"Unable to get liked videos")
    }
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: mongoose.Types.ObjectId(authenticatedId?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos"
            }
        },
    ])

    return res
    .status(200)
    .json(apiResponse(200, likedVideos[0] ,"liked videos"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}