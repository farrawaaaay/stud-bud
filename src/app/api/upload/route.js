import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import File from "@/models/File"; // Your File Mongoose model

// Initialize Google Cloud Storage with your credentials
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to your Google Cloud service account key file
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME); // Set the Cloud Storage bucket name

export const POST = async (req) => {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder"); 

    // Check if a file is received
    if (!file || !folder) {
      return NextResponse.json({ error: "No file or folder specified." }, { status: 400 });
    }

    // Get the JWT token from the request headers
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Verify the JWT token and retrieve the studentId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    // Convert the file stream to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create a new Promise to handle the upload and ensure a response is returned
    const uploadPromise = new Promise((resolve, reject) => {
      const fileName = `${file.name.replaceAll(" ", "_")}`; // Sanitize and include folder name
      const fileStream = bucket.file(fileName).createWriteStream({
        metadata: {
          contentType: file.type, // Set the file type for proper handling
        },
      });

      // Pipe the file buffer into the storage stream
      streamifier.createReadStream(fileBuffer).pipe(fileStream);

      // Handle the stream finish event
      fileStream.on("finish", async () => {
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        
        // Connect to the database
        await connectDB();

        // Save the file URL, folder, and studentId in the database
        const newFile = new File({
          studentId,
          fileUrl,
          fileName,
          fileType: file.type,
          folderName: folder, // Save the folder name
        });

        await newFile.save();

        resolve({ fileUrl });
      });

      // Handle errors during the upload
      fileStream.on("error", (error) => {
        console.error("Error uploading to Google Cloud Storage:", error);
        reject(error);
      });
    });

    // Wait for the upload to finish and return the result
    const storageResponse = await uploadPromise;

    return NextResponse.json({
      Message: "Success",
      fileUrl: storageResponse.fileUrl,
      status: 201,
    });

  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};


// GET method for retrieving the list of uploaded files
export const GET = async (req) => {
  try {
    // Get the JWT token from the request headers
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Verify the JWT token and retrieve the studentId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    // Get the folderName parameter from the query
    const folderName = req.nextUrl.searchParams.get('folderName'); // Access folderName here

    // Connect to the database
    await connectDB();

    // Retrieve the list of files uploaded by the student, optionally filtered by folderName
    const filter = { studentId };
    if (folderName) {
      filter.folderName = folderName; // Filter by folderName if provided
    }

    const files = await File.find(filter);

    // If there are no files, return a message indicating no files found
    if (!files || files.length === 0) {
      return NextResponse.json({ message: "No files found in this folder." }, { status: 200 });
    }

    // If files exist, return the list of files
    return NextResponse.json({ files });

  } catch (error) {
    console.error("Error retrieving files:", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};