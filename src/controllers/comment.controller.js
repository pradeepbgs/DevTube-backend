import mongoose from "mongoose"
import commentModel from "../models/comment.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(videoId)) {
      throw apiError(400, "Invalid video id");
  }

  const result = await commentModel.aggregate([
      {
          $match: {
              video: mongoose.Types.ObjectId(videoId),
          },
      },
      {
          $lookup: {
              from: "comments", 
              localField: "video",
              foreignField: "_id",
              as: "comments",
          },
      },
      {
          $skip: (page - 1) * limit,
      },
      {
          $limit: limit,
      },
      {
          $project: {
              comments: 1,
              totalCount: { $size: "$comments" },
          },
      },
  ]);

  const { comments, totalCount } = result[0];

  if (totalCount === 0) {
      return res.status(200).json(apiResponse(200, "No comments found", []));
  }

  return res
      .status(200)
      .json(apiResponse(200, "Comments found", { comments, totalCount }));
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const userId = req.user;

    if (!mongoose.isValidObjectId(videoId) || !req.user._id) {
        throw apiError(400, "Invalid video id or user id");
    }

    const content = req.body; 
    if (!content) {
        throw apiError(400, "Comment text is required");
    }

    const comment = await commentModel.create({
        content,
        video: videoId,
        owner: userId,
    });

    if (!comment) {
        throw apiError(400, "Comment could not be created");
    }

    return res
        .status(201)
        .json(apiResponse(200, "Comment successful"));
});


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const userId = req.user._id;
  
    try {
      if (!mongoose.isValidObjectId(commentId)) {
        throw apiError(400, "Invalid comment ID");
      }
  
      const  content  = req.body;
  
      const updatedComment = await commentModel.findOneAndUpdate(
        {
          _id: commentId,
          owner: userId,
        },
        { content: content },
        { new: true } 
      );
  
      if (!updatedComment) {
        throw apiError(404, "Comment not found or you don't have permission to update it");
      }
  
      return res
      .status(200)
      .json(apiResponse(200, "Comment updated successfully", updatedComment));
    } catch (error) {
      throw apiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
  });

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(commentId) || userId) {
        throw apiError(400, "Invalid comment ID or USER ID");
    }

    await commentModel.deleteOne({
        _id: commentId,
        owner: userId,
    })

    return res
        .status(200)
        .json(apiResponse(200, "Comment deleted successfully"))
})




export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }