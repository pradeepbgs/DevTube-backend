import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { 
    createTweet, 
    deleteTweet, 
    getUserTweets, 
    updateTweet 
} from "../controllers/tweet.js";
import exp from "constants";





const router = Router();


router.use(verifyJWT)  


router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);


export default router;