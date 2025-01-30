// models/Folder.js
import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    folderName: {
      type: String,
      required: true,
      unique: true,
    },
    studentID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Folder || mongoose.model("Folder", folderSchema);
