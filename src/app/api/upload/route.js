import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import streamifier from "streamifier";  // To convert stream to buffer

// Initialize Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file");

    // Check if a file is received
    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    // Convert the file stream to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create a new Promise to handle the upload and ensure a response is returned
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream({
        folder: "Studbud/Files", // Files will be uploaded to the "user_uploads" folder
        public_id: file.name.replaceAll(" ", "_"),
        resource_type: "raw", // Sanitize file name
      }, (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary", error);
          reject(error);
        } else {
          resolve(result);
        }
      }).end(fileBuffer); // We end the stream with the buffer
    });

    // Wait for the upload to finish and return the result
    const cloudinaryResponse = await uploadPromise;

    return NextResponse.json({
      Message: "Success",
      fileUrl: cloudinaryResponse.secure_url,
      status: 201,
    });

  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
