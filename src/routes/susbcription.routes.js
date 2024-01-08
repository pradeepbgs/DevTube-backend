import { Router } from "express";
import { subscriber, unsubscribe } from "../controllers/subscription.js";
import { verifyJwt } from "../middleware/verifyJwt.js";


const router = Router();


/// subscription 

router.route('/subscribe/:channelId').post(verifyJwt, subscriber);

router.route('/unsubscribe/:channelId').post(verifyJwt, unsubscribe);


export default router;