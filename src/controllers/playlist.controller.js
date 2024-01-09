import mongoose, { isValidObjectId } from "mongoose";
import Playlist from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  if (!name) {
    throw new apiError(400, "name is required");
  }

  const authenticatedId = req.user;
  if (!authenticatedId) {
    throw new apiError(400, "user is not authenticated");
  }

  const playlist = await Playlist.create({
    name,
    description: description || "",
    owner: authenticatedId?._id,
  });
  if (!playlist) {
    throw new apiError(400, "playlist is not created");
  }

  return res
    .status(201)
    .json(apiResponse(true, playlist, "playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!userId) {
    throw new apiError(400, "user id is required");
  }

  if (!isValidObjectId(userId)) {
    throw new apiError(400, "user id is not valid");
  }

  const playlists = await Playlist.findOne({ owner: userId });
  if (!playlists) {
    throw new apiError(400, "playlists not found");
  }

  return res
    .status(200)
    .json(apiResponse(200, playlists, "playlists found successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new apiError(400, "playlist id is not valid OR playlist id is required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new apiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(apiResponse(200, playlist, "playlist found successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new apiError(400, "playlist id is required OR playlist id is not valid");
  }
 
  if (!isValidObjectId(videoId) || !videoId) {
    throw new apiError(400, "video id is not valid or required");
  }

  const playlist = await Playlist.findByIdAndUpdate({
    _id: playlistId,
    owner: req.user?._id,
    $push: { videos: videoId },
  });

  return res
    .status(200)
    .json(apiResponse(200, playlist, "video added to playlist successfully"));
    
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!playlistId || !isValidObjectId(playlistId) || !videoId || !isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid playlist or video ID");
  }

  const authenticatedId = req.user;

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: authenticatedId?._id,
    },
    {
      $pull: { videos: videoId },
    },
    {new: true}
  );
  if (!playlist) {
    throw new apiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(apiResponse(200, "video removed from playlist successfully"));

});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new apiError(400, "Invalid playlist ID");
  }
  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user?._id,
  });

  if (!playlist) {
    throw new apiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(apiResponse(200, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new apiError(400, "Invalid playlist ID");
  }
  const playlist = await Playlist.findOne({
    _id: playlistId,
    owner: req.user?._id,
  })

  if(name){
    playlist.name = name;
  }
  if(description){
    playlist.description = description;
  }
  await playlist.save();

  return res
    .status(200)
    .json(apiResponse(200, "playlist updated successfully"));

});


export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
