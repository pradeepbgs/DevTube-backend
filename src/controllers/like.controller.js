import mongoose, { isValidObjectId } from "mongoose";
import Like from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId || !isValidObjectId(videoId)) {
        return res.status(400).json(new apiError(400, "Invalid video ID"));
    }

    const authenticatedId = req.user?._id;
    const liked = await Like.create({
        video: videoId,
        likedBy: authenticatedId
    });

    if (!liked) {
        return res.status(400).json(new apiError(400, "Unable to like video"));
    }

    return res.status(200).json(new apiResponse(200, "Like toggled"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId || !isValidObjectId(commentId)) {
        return res.status(400).json(new apiError(400, "Invalid comment ID"));
    }

    const authenticatedId = req.user?._id;
    if (!authenticatedId) {
        return res.status(400).json(new apiError(400, "Unable to like comment"));
    }

    const likedComment = await Like.create({
        comment: commentId,
        likedBy: authenticatedId
    });

    if (!likedComment) {
        return res.status(400).json(new apiError(400, "Unable to like comment"));
    }

    return res.status(200).json(new apiResponse(200, "Liked comment"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!tweetId || !isValidObjectId(tweetId)) {
        return res.status(400).json(new apiError(400, "Invalid tweet ID"));
    }

    const authenticatedId = req.user?._id;
    if (!authenticatedId) {
        return res.status(400).json(new apiError(400, "Unable to like tweet"));
    }

    const likedTweet = await Like.create({
        tweet: tweetId,
        likedBy: authenticatedId
    });

    if (!likedTweet) {
        return res.status(400).json(new apiError(400, "Unable to like tweet"));
    }

    return res.status(200).json(new apiResponse(200, "Liked tweet"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const authenticatedId = req.user?._id;
    if (!authenticatedId) {
        return res.status(400).json(new apiError(400, "Unable to get liked videos"));
    }

    const likedVideos = await Like.aggregate([
        {
            $match: { likedBy: new mongoose.Types.ObjectId(authenticatedId) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos"
            }
        }
    ]);

    return res.status(200).json(new apiResponse(200, likedVideos[0], "Liked videos"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
