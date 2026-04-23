import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    page: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

visitSchema.index({ createdAt: 1 });
visitSchema.index({ project: 1 });

export default mongoose.model('Visit', visitSchema);
