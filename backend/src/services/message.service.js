import Message from '../models/Message.js';
import ApiError from '../utils/ApiError.js';

export const createMessage = async (data, senderId = null) =>
  Message.create({ ...data, sender: senderId });

export const listMessages = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    Message.find().populate('sender', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Message.countDocuments(),
  ]);
  return { messages, total, page, pages: Math.ceil(total / limit) };
};

export const listUserMessages = async (userId) =>
  Message.find({ sender: userId }).sort({ createdAt: -1 });

export const markMessageRead = async (id) => {
  const msg = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });
  if (!msg) throw ApiError.notFound('Message not found');
  return msg;
};

export const deleteMessage = async (id) => {
  const msg = await Message.findByIdAndDelete(id);
  if (!msg) throw ApiError.notFound('Message not found');
  return msg;
};
