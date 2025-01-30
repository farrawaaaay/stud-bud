import mongoose from 'mongoose';

const WorkspaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  createdAt: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false }, // Adding the 'isDefault' field
});

const Workspace = mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema);
export default Workspace;