import { Router } from "express";
import { subscriber, unsubscribe } from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();


/// subscription 

router.route('/subscribe/:channelId').post(verifyJwt, subscriber);

router.route('/unsubscribe/:channelId').post(verifyJwt, unsubscribe);


export default router;