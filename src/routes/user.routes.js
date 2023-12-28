import { Router } from "express";
import { 
    registerUser , 
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { 
    deleteVideo, 
    thumbnailChnage,
     videoDetails, 
     videoDetailsChange, 
     videoUpload 
    } from "../controllers/video.controller.js";

const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)  

// secured routes

router.route("/logout").post( verifyJwt , logoutUser)
router.route('/refresh-token').post( refreshAccessToken)
router.route('/change-password').post( verifyJwt , changeCurrentPassword)
router.route('/current-user').get( verifyJwt , getCurrentUser)
router.route('/update-account-details').patch(verifyJwt, 
    updateAccountDetail)
 
router.route('/avatar-change').patch(verifyJwt, upload.single('avatar'), 
updateUserAvatar)

router.route('/cover-image').patch(verifyJwt, upload.single('coverImage'),
updateUserCoverImage)

router.route('/channel/:username').get(verifyJwt, getCurrentUser)
router.route('/history').get(verifyJwt, getWatchHistory)

// routes for video upload
router.route('/upload').post(verifyJwt, upload.single('video'),videoUpload)

router.route('/change-thumbnail')
.patch(verifyJwt, upload.single('thumbnail'), thumbnailChnage)

router.route('/video-details/:id').get(verifyJwt, videoDetails)

router.route('/video-details-change').patch(verifyJwt, videoDetailsChange)

router.route('/video-delete').post(verifyJwt, deleteVideo)

export default router;