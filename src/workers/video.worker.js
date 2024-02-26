import { parentPort , workerData} from "worker_threads";
import {uploadOnCloudinary} from '../utils/cloudinary.js'

 const uploadVideoWorker = async () => {
    try {
        const { videoFile, thumbnail } = workerData;

        const video = await uploadOnCloudinary(videoFile);
        const thumbnailUrl = await uploadOnCloudinary(thumbnail);
        

        parentPort.postMessage({ video, thumbnailUrl });
    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
}

uploadVideoWorker();