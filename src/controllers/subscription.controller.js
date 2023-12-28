import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { subscriptionModel } from "../models/subscription.model";
import { apiResponce } from "../utils/apiResponce";

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







export {
    subscriber
}
