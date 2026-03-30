import { asyncHandler } from "../common/asyncHandler";
import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { sendError, sendSuccess } from "../common/response";
import { IUser } from "../model/users.model";
import { deleteFromCloudinary, extractPublicId } from "../utils/cloudinary";
import { generateAccessToken, generateRefreshToken } from "../config/token";
import { AuthRequest } from "../middleware/auth.middleware";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, ...filter } = req.query;

  const result = await UserRepository.findAll(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  return sendSuccess(res, {
    items: result.users,
    metadata: result.pagination,
  });
});

export const getFirstUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserRepository.findAll({});
    const firstUser = user.users[0];
    if (!firstUser) return sendError(res, "No users found", 404);
    return sendSuccess(res, firstUser, "Request successfull");
  },
);

export const getOneUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    const user = await UserRepository.findById(id as string);

    if (!user) return sendError(res, "User does not exist");

    return sendSuccess(res, user, "Request successfull");
  },
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) return sendError(res, "Unauthorized", 401);

  const body = req.body as Partial<IUser> & {
    avatar_url?: string;
    resume_url?: string;
    oldAvatarPublicId?: string | null;
    oldResumePublicId?: string | null;
  };

  const currentUser = await UserRepository.findById(userId as string);
  if (!currentUser) return sendError(res, "User not found", 404);

  // Set old public IDs for deletion (if new file was uploaded)
  if (body.avatar_url && currentUser.avatar_url) {
    body.oldAvatarPublicId = extractPublicId(currentUser.avatar_url);
  }
  if (body.resume_url && currentUser.resume_url) {
    body.oldResumePublicId = extractPublicId(currentUser.resume_url);
  }

  if (body.password) {
    await UserRepository.updatePassword(userId as string, body.password);
  }

  const updateData: Partial<IUser> = {
    email: body.email ?? currentUser.email,
    fullName: body.fullName ?? currentUser.fullName,
    avatar_url: body.avatar_url ?? currentUser.avatar_url,
    resume_url: body.resume_url ?? currentUser.resume_url,
    bio: body.bio ?? currentUser.bio,
    job_title: body.job_title ?? currentUser.job_title,
    stack: body.stack ?? currentUser.stack,
    github_link: body.github_link ?? currentUser.github_link,
    linkedin_link: body.linkedin_link ?? currentUser.linkedin_link,
    twitter_link: body.twitter_link ?? currentUser.twitter_link,
    role: body.role ?? currentUser.role,
  };

  // Remove undefined
  Object.keys(updateData).forEach((k) => {
    if ((updateData as any)[k] === undefined) delete (updateData as any)[k];
  });

  await UserRepository.updateById(userId as string, updateData);

  // Delete old files from Cloudinary (after successful update)
  if (body.oldAvatarPublicId)
    await deleteFromCloudinary(body.oldAvatarPublicId);
  if (body.oldResumePublicId)
    await deleteFromCloudinary(body.oldResumePublicId);

  return sendSuccess(res, null, "Profile updated successfully");
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as IUser;

  await UserRepository.create({ ...body });

  return sendSuccess(res, {}, "User Created SuccessFully", 201);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await UserRepository.findById(id as string);

  if (!user) return sendError(res, "User does not exist", 404);

  await UserRepository.deleteById(id as string);

  return sendSuccess(res, {}, "User deleted");
});
