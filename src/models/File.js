import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,  // Assuming you have a 'Student' model
      ref: "Student",                        // Reference to the Student model
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    folderName: {
      type: String,  // You can also use ObjectId if you reference a Folder model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.File || mongoose.model("File", fileSchema);
