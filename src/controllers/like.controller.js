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
  const existingLiked = await Like.findOneAndDelete({
    video: videoId,
    likedBy: authenticatedId,
  });

  let message = "";
  let newLikedVideo = null;

  if (existingLiked) {
    message = "unliked video";
  } else {
    newLikedVideo = await Like.create({
      video: videoId,
      likedBy: authenticatedId,
    });
    if (!newLikedVideo) {
      return res.status(400).json(new apiError(400, "Unable to like video"));
    }
    message = "liked video";
  }

  return res.status(200).json(new apiResponse(200, newLikedVideo, message));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId || !isValidObjectId(commentId)) {
    return res.status(400).json(new apiError(400, "Invalid comment ID"));
  }

  const authenticatedId = req.user?._id;
  const existingLiked = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: authenticatedId,
  });

  let message = "";
  let newLikedComment = null;

  if (existingLiked) {
    message = "unliked comment";
  } else {
    newLikedComment = await Like.create({
      video: videoId,
      likedBy: authenticatedId,
    });
    if (!newLikedComment) {
      return res.status(400).json(new apiError(400, "Unable to like video"));
    }
    message = "liked comment";
  }

  return res.status(200).json(new apiResponse(200, newLikedComment, message));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId || !isValidObjectId(tweetId)) {
    return res.status(400).json(new apiError(400, "Invalid tweet ID"));
  }

  const authenticatedId = req.user?._id;
  const existingLiked = await Like.findOneAndDelete({
    video: videoId,
    likedBy: authenticatedId,
  });

  let message = "";
  let newLikedTweet = null;

  if (existingLiked) {
    message = "unliked tweet";
  } else {
    newLikedTweet = await Like.create({
      tweet: tweetId,
      likedBy: authenticatedId,
    });
    if (!newLikedTweet) {
      return res.status(400).json(new apiError(400, "Unable to like video"));
    }
    message = "liked tweet";
  }

  return res.status(200).json(new apiResponse(200, newLikedTweet, message));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const authenticatedId = req.user?._id;
  if (!authenticatedId) {
    return res
      .status(400)
      .json(new apiError(400, "Unable to get liked videos"));
  }

  const likedVideos = await Like.aggregate([
    {
      $match: { likedBy: new mongoose.Types.ObjectId(authenticatedId) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, likedVideos[0], "Liked videos"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
