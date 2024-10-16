const cloudinary = require("cloudinary").v2;
const fs = require("fs")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const handleUpload= async (localFilePath,apiOptions)=> {
    try {
        res = cloudinary.uploader.upload(localFilePath,apiOptions);
        return res;
    }
    catch(err) {
        console.log("error occured while uploading the file!:"+err);
    }
}
 
module.exports = handleUpload;