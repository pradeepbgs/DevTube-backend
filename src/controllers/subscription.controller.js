import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription as subscriptionModel} from "../models/subscription.model.js";
import { apiResponce } from "../utils/apiResponce.js";

const subscriber  = asyncHandler(async (req, res) => {
    // get the user who is trying to subscribe
    // get the channel whom he is trying to
    // check if the user is already subscribed to the channel
    // if yes, then return error
    // if no, then create a new subscription
    // return the subscription

    // this the one who wants to subscribe a channel
    const user = req.user;
    const {channelId} = req.params;
    try {
        if(!user){
            throw new apiError(401, "user not found")
        }

        if(!channelId){
            throw new apiError(401, "channel not found")
        }

        // check if the user is already subscribed to the channel

        const existingSubscription = await subscriptionModel.findOne({
            user: user._id,
            channel: channelId,
        })

        if(existingSubscription){
            throw new apiError(401, "user is already subscribed to the channel")
        }


        // after checking the user is not subscribed to the channel, we are now letting him subscribe now
        const subscription = await subscriptionModel.create({
            user: user._id,
            channel: req.params.channelId,
        })

        return res
        .status(200)
        .json(
            new apiResponce(
                200,
                subscription,
                "subscription successfull"
            )
        )
    } catch (error) {
        throw new apiError(401, "error while subscribing")
    }

})

const unsubscribe = asyncHandler(async (req, res) => {
    // get the user
    // get the channel
    // delete the subscription
    // return the res

    const user = req.user;
    const {channelId} = req.params;

    try {
        if(!user){
            throw new apiError(401, "user not found")
        }
        if(!channelId){
            throw new apiError(401, "channel not found")
        }

       const subscription =   await subscriptionModel.findOneAndDelete({
            user: user._id,
            channel: channelId,
        })

        if(!subscription){
            throw new apiError(401, "user is not subscribed to the channel")
        }

        return res
        .status(200)
        .json(
            new apiResponce(
                200,
                subscription,
                "unsubscription successfull"
            )
        )

    } catch (error) {
        throw new apiError(401, "error while unsubscribing")
    }
})





export {
    subscriber,
    unsubscribe,
}
