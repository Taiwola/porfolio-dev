import { asyncHandler } from "../common/asyncHandler";
import { AuthRequest } from "../middleware/auth.middleware";
import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { sendError, sendSuccess } from "../common/response";
import projectRepository from "../repository/project.repository";
import { IProject } from "../model/project.model";
import { QueryOptions } from "mongoose";
import { extractPublicId } from "../utils/cloudinary";

export const getAllProjects = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, search, status, category } = req.query;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { techStack: { $in: [new RegExp(search as string, "i")] } },
      ];
    }

    // Filter by status
    if (status) {
      filter["status"] = status;
    }

    // Filter by category
    if (category) {
      filter["category"] = { $regex: category, $options: "i" };
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
      lean: true,
    };

    const result = await projectRepository.findAll(filter, options);

    return sendSuccess(res, {
      items: result.docs,
      metadata: {
        total: result.totalDocs,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage,
      },
    });
  },
);

export const getProjectById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id;
    const project = await projectRepository.findById(id as string);

    if (!project) return sendError(res, "Project does not exist");

    return sendSuccess(res, project, "Request successfull");
  },
);

export const createProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const projectData = req.body as Partial<IProject> & { coverImage: string };

    const user = await UserRepository.findById(userId as string);

    if (!user) return sendError(res, "Unauthorized", 401);

    const project = await projectRepository.create({
      ...projectData,
      userId: user._id,
      coverImage: projectData.coverImage
    });

    return sendSuccess(res, project, "Project created successfully");
  },
);

export const updateProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const projectId = req.params.id;
    const updateData = req.body as Partial<IProject> & {
      oldCoverImagePublicId?: string | null;
      coverImage: string;
    };

    const project = await projectRepository.findById(projectId as string);

    if (!project) return sendError(res, "Project does not exist", 404);

    if (updateData.coverImage && project.coverImage) {
      updateData.oldCoverImagePublicId = extractPublicId(project.coverImage);
    }

    if (project.userId.toString() !== userId)
      return sendError(res, "Unauthorized", 401);

    const projectDataToUpdate: Partial<IProject> = {
      name: updateData.name ?? project.name,
      description: updateData.description ?? project.description,
      techStack: updateData.techStack ?? project.techStack,
      coverImage: updateData.coverImage ?? project.coverImage,
      category: updateData.category ?? project.category,
      status: updateData.status ?? project.status,
      links: updateData.links ?? project.links,
    };

    const updatedProject = await projectRepository.updateById(
      projectId as string,
      projectDataToUpdate,
    );

    return sendSuccess(res, updatedProject, "Project updated successfully");
  },
);

export const deleteProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const projectId = req.params.id;
    const project = await projectRepository.findById(projectId as string);
    if (!project) return sendError(res, "Project does not exist", 404);
    if (project.userId.toString() !== userId)
      return sendError(res, "Unauthorized", 401);

    await projectRepository.deleteById(projectId as string);

    return sendSuccess(res, null, "Project deleted successfully");
  },
);
