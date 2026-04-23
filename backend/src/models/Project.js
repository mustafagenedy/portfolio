import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    architecture: { type: String, default: '' },
    challenges: { type: String, default: '' },
    category: {
      type: String,
      enum: ['full-stack', 'backend', 'machine-learning', 'it-systems'],
      required: true,
    },
    techStack: [{ type: String }],
    images: [{ url: String, publicId: String }],
    thumbnail: { url: String, publicId: String },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
