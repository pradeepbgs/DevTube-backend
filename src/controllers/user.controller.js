import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";
import fs from "fs";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (userId) => {
  try {
       const user = await User.findById(userId)
       const accesToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})

      return {accesToken, refreshToken}

  } catch (error) {
    throw new apiError(500, "something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async(req, res) => {

     // get the details from user ---done
     // validation - not empty ----done
     // check if user already exists : usernme , email ---done
     //check for image, check for avatar ---done
     // upload them to cloudinary, avatar ---done
     // create user object - create entry in db ---done
     // remove password and refresh token field from response --done
     // check for user creation  ---done
     // return response --done

   const {fullname, email, username, password} =  req.body
   
   
   if(
    [fullname, email, username, password].some((field) => field?.trim() === "")
   ){
        throw new apiError("All field are required", 400)
   }

   const existedUser = await User.findOne({
     $or:[{ username },{ email }]
   })

   if(existedUser){
    fs.unlinkSync(req.files?.avatar[0].path)
    console.log("user already exist with this  uername or email")
      throw new apiError("User already exists", 409)
   }

   console.log("this is req.files = ",req.files)
  const avatarLocalpath =  req.files?.avatar[0]?.path;
//   const coverImageLocalpath =  req.files?.coverImage[0]?.path;
let coverImageLocalpath;
 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalpath = req.files.coverImage[0].path;
 }

  if(!avatarLocalpath){
      console.log("Avatar is required line no 42")
     throw new apiError("Avatar is required", 400)
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath)
  const coverImage = await uploadOnCloudinary(coverImageLocalpath)
  console.log("avatar", avatar)
  console.log("coverImage", coverImage)
  if(!avatar){
      console.log("Avatar uploading problem on cloudinary line no 50") 
     throw new apiError("Avatar is required", 400)
  }

 const user = await User.create({
     fullname:fullname,
     avatar: avatar.url || "",
     coverImage: coverImage?.url || "",
     email: email,
     password: password,
     username: username.toLowerCase()
 })

 const createdUser = await User.findById(user._id).select(
     "-password -refreshToken"
 )


 if(!createdUser){
     throw new apiError("User not created, something went wrong while creating user", 500)
 }

 return res.status(201).json(
     new apiResponce(200, createdUser,"User created successfully")
 )

})

const loginUser = asyncHandler(async(req, res) => {
    // get the details from user from req.body  ---done
    // username or email
    // find the user
    // if password is correct
    // generate access and refresh token
    // send cookies
    // send response if its logged in

    const {username, email, password} = req.body
    console.log("this is req.body = ",req.body)

    if(!(username || email)){
      throw new apiError(400,"Username or email is required")
    }

    const user = await User.findOne({
      $or: [{email}, {username}]
    })

    if(!user){
      throw new apiError(404,"User not found")
    }

    const isPasswordValid = user.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new apiError(401,"Invalid User Password")
    }

   const {accesToken, refreshToken} =  await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id)
   .select("-password -refreshToken")

   const options = {
     httpOnly: true,
     secure: true,
   }

   return res.status(200)
   .cookie("accessToken", accesToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new apiResponce(
      200, 
      {
        user: loggedInUser,
        accessToken: accesToken,
        refreshToken: refreshToken,
      },
      "User logged in successfully"
    )
   )
})

const logoutUser = asyncHandler(async(req, res) => {
     // clear cookie    
   await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        refreshToken: null
      }
    } , {
      new: true
    })

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new apiResponce(200, {}, "user logged out")
    )
 
})

const refreshAccessToken = asyncHandler( async (req, res) => {

   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken) throw new apiError(401, "unauthorized request")

   try {
    const decodedToken =  jwt.verify(
     incomingRefreshToken, 
     process.env.REFRESH_ACCESS_TOKEN
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if(!user) throw new apiError(401, "invalid refresh toke")
 
     if(incomingRefreshToken !== user.refreshToken) throw new apiError(
       401, "refresh token is expired or used"
       )
 
       const options = {
         httpOnly: true,
         secure: true,
       }
 
     const {accesToken, newRefreshToken} =   await generateAccessAndRefreshToken(user._id)
 
      return res
      .status(200)
      .cookie("accessToken", accesToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
       new apiResponce(
         200,
         {accesToken, refreshToken: newRefreshToken},
         "Access Token refreshed successfully"
       )
      )
   } catch (error) {
    throw new apiError(401, error?.message || "something went wrong while refreshing access token")
   }
    
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
      const {oldPassword, newPassword} = req.body

      const user = await User.findById(req.user?._id)

     const isPasswordCorrect =  await user.isPasswordCorrect(oldPassword)

     if(!isPasswordCorrect){
       throw new apiError(400, "Old password is incorrect")
     }

     user.password = newPassword
     await user.save({validateBeforeSave: false})

     return res
     .status(200)
     .json(
      new apiResponce(
        200,
        {},
        "Password changed successfully"
      )
     )
     
})

const getCurrentUser = asyncHandler( async (req, res) => {
   return res
   .status(200)
   .json(200, req.user, "cuurentUser fetched successfully")
})


const updateAccountDetail = asyncHandler( async (req, res) => {
  const {fullname, email} = req.body

  if(!(fullname || email)){
    return new apiError(400, "fullname or email is required")
  }


  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email
      }
    },
    {new : true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new apiResponce(
      200,
      user,
      "Account details updated successfully"
    )
  )

})


const updateUserAvatar = asyncHandler( async (req, res) => {
   const user = req.user;

   const avatarLocalpath =  req.file?.path

   if(!avatarLocalpath) return new apiError(400, "Avatar file is missing")


   const avatar = await uploadOnCloudinary(avatarLocalpath)
   if(!avatar.url) return new apiError(400, "Error while uploading on cloudinary, user.controller.js line no 299")
   
   user.avatar = avatar.url
   await user.save({validateBeforeSave: false})

   return res
  .status(200)
  .json(
    new apiResponce(
      200,
      user,
      "Avatar image updated successfully"
    )
  )
})

const updateUserCoverImage = asyncHandler( async (req, res) => {
  const user = req.user;

  const coverImageLocalpath =  req.file?.path

  if(!coverImageLocalpath) return new apiError(400, "Cover image file is missing")


  const coverImage = await uploadOnCloudinary(coverImageLocalpath)
  if(!coverImage.url) return new apiError(400, "Error while uploading on cloudinary, user.controller.js line no 314")
  
  user.coverImage = coverImage.url
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(
    new apiResponce(
      200,
      user,
      "CoverImage updated successfully"
    )
  )
})

export {
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  updateUserCoverImage
}