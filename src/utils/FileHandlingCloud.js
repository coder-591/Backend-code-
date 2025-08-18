import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const fileUploader = async (localFilePath) => {
  try {
    if (!localFilePath) return console.log("Path is undefiend");
    //    uploading file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("File upload successfully", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // two error comes 1- is uploading error and 2- is mistake in  localFilePath
    // you known that localFile is in your database  when you use cloudinary so you have to unlink file from database
    fs.unlinkSync(localFilePath); // it remove the locally saved file as the upload operation got failed
    console.log("Cloudinary err", error);
  }
};
export { fileUploader };
