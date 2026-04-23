import mongoose from 'mongoose';

const savedProjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

savedProjectSchema.index({ user: 1, project: 1 }, { unique: true });

export default mongoose.model('SavedProject', savedProjectSchema);
