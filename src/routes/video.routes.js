import { Router } from "express";
import { 
    videoUpload, 
    videoDetails,  
    deleteVideo ,
    updateVideo,
    togglePublishStatus,
    getAllVideos,
    getUserVideos,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";



const router = Router();
router.use(verifyJwt)

// routes for video upload
router.route('/')
.get(getAllVideos)
.post(upload.fields([
    {
        name: 'video',
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]), videoUpload)


router
    .route('/:videoId')
    .get(videoDetails)
    .delete(deleteVideo)
    .patch(upload.single('thumbnail'),updateVideo);

router.route('/c/:userId').get(getUserVideos)

router.route('/toggle/publish/:videoId').patch(togglePublishStatus);

export default router;