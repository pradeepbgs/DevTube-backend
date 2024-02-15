import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import { strictLoggedUserMiddlewares } from '../middlewares/strictLoggedUser.js';

const router = Router();

router.use(strictLoggedUserMiddlewares); 

router.route("/stats/:channelId").get(getChannelStats);
router.route("/videos/:channelId").get(getChannelVideos);

export default router  