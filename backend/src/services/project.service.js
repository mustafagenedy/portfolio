import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';
import { slugify } from '../utils/slugify.js';

export const listProjects = async ({ category, featured, includeHidden = false } = {}) => {
  const filter = includeHidden ? {} : { visible: true };
  if (category) filter.category = category;
  if (featured === 'true' || featured === true) filter.featured = true;
  return Project.find(filter).sort({ order: 1, createdAt: -1 });
};

export const getProjectBySlug = async (slug) => {
  const project = await Project.findOneAndUpdate(
    { slug, visible: true },
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (!project) throw ApiError.notFound('Project not found');
  return project;
};

export const createProject = async (data) => {
  if (!data.slug && data.title) data.slug = slugify(data.title);
  return Project.create(data);
};

export const updateProject = async (id, data) => {
  if (data.title && !data.slug) data.slug = slugify(data.title);
  const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!project) throw ApiError.notFound('Project not found');
  return project;
};

export const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw ApiError.notFound('Project not found');

  const publicIds = [
    ...project.images.map((i) => i.publicId).filter(Boolean),
    project.thumbnail?.publicId,
  ].filter(Boolean);

  await Promise.all(publicIds.map((pid) => cloudinary.uploader.destroy(pid)));
  return project;
};

/** Upload image buffers to Cloudinary and attach to the project. */
export const addProjectImages = async (id, files) => {
  const project = await Project.findById(id);
  if (!project) throw ApiError.notFound('Project not found');

  const uploads = await Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio/projects' },
            (err, result) =>
              err
                ? reject(err)
                : resolve({ url: result.secure_url, publicId: result.public_id })
          );
          stream.end(file.buffer);
        })
    )
  );

  project.images.push(...uploads);
  if (!project.thumbnail?.url && uploads.length) project.thumbnail = uploads[0];
  await project.save();
  return project;
};
