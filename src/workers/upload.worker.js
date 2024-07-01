import { parentPort , workerData} from "worker_threads";
import {uploadOnCloudinary} from '../utils/cloudinary.js'

 const uploadWorker = async () => {
    try {
        const { videoFile, thumbnail , avatarLocalpath, coverImageLocalpath} = workerData;
        console.log("Worker data received:", workerData);
        let video;
        if (videoFile) {
            video = await uploadOnCloudinary(videoFile);
            console.log("video uploaded: ",video);
        }

        let thumbnailUrl;
        if (thumbnail) {
            thumbnailUrl = await uploadOnCloudinary(thumbnail);
            console.log("thumbnail uploaded: ",thumbnailUrl);

        }

        let avatar;
        if(avatarLocalpath){
            avatar = await uploadOnCloudinary(avatarLocalpath);
        }

        let coverImage;
        if(coverImageLocalpath){
            coverImage = await uploadOnCloudinary(coverImageLocalpath);
        }
        
        parentPort.postMessage({ video, thumbnailUrl , avatar, coverImage});
    } catch (error) {
        console.error("Worker upload error:", error);
        parentPort.postMessage({ error: error.message });
    }
}

uploadWorker();