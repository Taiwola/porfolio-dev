import { asyncHandler } from "../common/asyncHandler";
import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import messageRepository from "../repository/message.repository";
import { sendError, sendSuccess } from "../common/response";
import { sendAdminReply } from "../mail";
import { mailQueue } from "../queues/mail.queue";

export const createMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { subject, message, fullName } = req.body;

    try {
      const create = await messageRepository.createMessage({
        message,
        subject,
        fullName,
      });

      return sendSuccess(res, create, "Message sent successfully", 201);
    } catch (error) {
      console.log(error);
      return sendError(res, "Failed to send message", 500);
    }
  },
);

export const getAllMessages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page, limit, isRead } = req.query;

    const filter: Record<string, unknown> = {};

    if (isRead) {
      filter.isRead = isRead === "true" ? true : false;
    }

    const result = await messageRepository.findAll(filter, {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    return sendSuccess(res, result, "Messages retrieved successfully", 200);
  },
);


export const getOneMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const messageId = req.params.id as string;
    const message = await messageRepository.findById(messageId);
    if (!message) {
        return sendError(res, "Message not found", 404);
    }
    return sendSuccess(res, message, "Message retrieved successfully", 200);
  })

export const updateMessageStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const messageId = req.params.id as string;
    const { isRead } = req.body;
    const messageExists = await messageRepository.findById(messageId);

    if (!messageExists) {
      return sendError(res, "Message not found", 404);
    }

    const message = await messageRepository.updateById(messageId, { isRead });

    if (!message) {
      return sendError(res, "Message not found", 404);
    }
  },
);

export const replyToMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const messageId = req.params.id as string;
    const { reply } = req.body;
    const messageExists = await messageRepository.findById(messageId);

    if (!messageExists) {
      return sendError(res, "Message not found", 404);
    }

    const { error, errorMessage } = await sendAdminReply(
      messageExists.email,
      messageExists.fullName,
      reply,
      messageExists.subject,
    );

    if (error) {
      await mailQueue.add("admin_reply", {
        type: "admin_reply",
        to: messageExists.email,
        payload: {
          to: messageExists.email,
          recipientName: messageExists.fullName,
          replyBody: reply,
          originalSubject: messageExists.subject,
        },
      });
      console.error("Failed to send admin reply:", errorMessage);
    }

    return sendSuccess(res, null, "Reply sent successfully", 200);
  },
);


export const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const messageId = req.params.id as string;
  const messageExists = await messageRepository.findById(messageId);

    if (!messageExists) {
        return sendError(res, "Message not found", 404);
    }
    await messageRepository.deleteById(messageId);
    return sendSuccess(res, null, "Message deleted successfully", 200);
})    