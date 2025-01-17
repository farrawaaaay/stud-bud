import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId, // Ensure mongoose is imported
    ref: 'Student', // Assuming you're referencing the 'Student' collection
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.models.File || mongoose.model('File', FileSchema);

export default File;
