import { Router } from "express";
import { 
    videoUpload, 
    videoDetails,  
    deleteVideo ,
    updateVideo,
    togglePublishStatus,
    getAllVideos,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { upload } from "../middlewares/upload.js";



const router = Router();
router.use(verifyJwt)

// routes for video upload
router.route('/')
.get(getAllVideos)
.post(upload.fields([
    {
        name: "video",
        maxCount: 1,
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]),videoUpload);


router
    .route('/:videoId')
    .get(videoDetails)
    .delete(deleteVideo)
    .patch(upload.single('thumbnail'),updateVideo);

router.route('/toggle/publish/:videoId').patch(togglePublishStatus);

export default router;