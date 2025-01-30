import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Folder from "@/models/Folder";
import File from "@/models/File"; // Your File Mongoose model
import { Storage } from "@google-cloud/storage";

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME); 

export const DELETE = async (req) => {
  try {
    // Extract the folder ID from the URL params
    const { folderId } = req.nextUrl.searchParams;
    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    // Get the JWT token from the request headers
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Verify the JWT token and retrieve the studentId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    // Connect to the database
    await connectDB();

    // Find the folder by ID and make sure it's owned by the student
    const folder = await Folder.findOne({ _id: folderId, studentID: studentId });
    if (!folder) {
      return NextResponse.json({ error: "Folder not found or unauthorized" }, { status: 404 });
    }

    // Delete all files associated with the folder from Cloud Storage
    const files = await File.find({ folderName: folder.folderName });
    files.forEach((file) => {
      const fileName = file.fileName.replaceAll(" ", "_");
      const fileObject = bucket.file(fileName);
      fileObject.delete().catch(console.error); // Delete the file from Google Cloud Storage
    });

    // Delete all files from the database
    await File.deleteMany({ folderName: folder.folderName });

    // Delete the folder from the database
    await Folder.deleteOne({ _id: folderId });

    return NextResponse.json({ message: "Folder and files deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
