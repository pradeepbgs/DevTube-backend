import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: "chai-with-backend", 
    api_key: 881654414367555, 
    api_secret: 'tqqkCQ7jCufbwwuhx_mMxD4cTu0'
  });


 const uploadOnCloudinary = async (localFilepath)=>{
    try {
        if(!localFilepath) return null;
        // upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type: "auto",
        })
        // file has been uploaded,
        // console.log("file has been uploaded", response.url);
        fs.unlinkSync(localFilepath)
        return response
    } catch (error) {
        // remove the locally saved temperory file as the upload operation got failed
        fs.unlinkSync(localFilepath)
        return null;
    }
 }


 export {uploadOnCloudinary}