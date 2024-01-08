import { Router } from "express";
import { 
    videoUpload, 
    videoDetails, 
    videoDetailsChange, 
    deleteVideo 
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { upload } from "../middlewares/upload.js";



const router = Router();


// routes for video upload
router.route('/upload').post(verifyJwt, upload.fields([
    {
        name: "video",
        maxCount: 1,
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]),videoUpload);


router.route('/video-details/:videoId').get(verifyJwt, videoDetails);

router.route('/video-details-change/:videoId')
.patch(verifyJwt,  upload.single('thumbnail'),videoDetailsChange);

router.route('/video-delete/:videoId').post(verifyJwt, deleteVideo);


export default router;