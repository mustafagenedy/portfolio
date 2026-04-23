import { asyncHandler } from '../utils/asyncHandler.js';
import * as messageService from '../services/message.service.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const msg = await messageService.createMessage(req.validated, req.user?._id || null);
  res.status(201).json({ message: 'Message sent successfully', id: msg._id });
});

export const getMessages = asyncHandler(async (req, res) => {
  const result = await messageService.listMessages({
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
  });
  res.json(result);
});

export const getMyMessages = asyncHandler(async (req, res) => {
  const messages = await messageService.listUserMessages(req.user._id);
  res.json(messages);
});

export const markRead = asyncHandler(async (req, res) => {
  const msg = await messageService.markMessageRead(req.params.id);
  res.json(msg);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await messageService.deleteMessage(req.params.id);
  res.json({ message: 'Message deleted' });
});
