import { PaginateOptions, PaginateResult, QueryFilter, UpdateQuery } from 'mongoose';
import { IProject, Project } from '../model/project.model';

export class ProjectRepository {
  /**
   * Create a new project
   */
  async create(projectData: Partial<IProject>): Promise<IProject> {
    const project = new Project(projectData);
    return await project.save();
  }

  /**
   * Find project by ID
   */
  async findById(id: string): Promise<IProject | null> {
    return await Project.findById(id).populate('userId', 'fullName email avatar_url');
  }

  /**
   * Find all projects with pagination + filtering
   */
  async findAll(
    filter: QueryFilter<IProject> = {},
    options: PaginateOptions = {}
  ): Promise<PaginateResult<IProject>> {
    const defaultOptions: PaginateOptions = {
      page: 1,
      limit: 10,
      sort: { createdAt: -1 },
      populate: [{ path: 'userId', select: 'fullName email avatar_url' }],
      ...options,
    };
    
    return await Project.paginate(filter, defaultOptions);
  }

  /**
   * Get projects belonging to a specific user
   */
  async findByUserId(
    userId: string,
    options: PaginateOptions = {}
  ): Promise<PaginateResult<IProject>> {
    return await this.findAll({ userId }, options);
  }

  /**
   * Get live projects for a specific user
   */
  async findLiveByUserId(
    userId: string,
    options: PaginateOptions = {}
  ): Promise<PaginateResult<IProject>> {
    return await this.findAll({ userId, status: 'Live' }, options);
  }

  /**
   * Update project by ID (with ownership safety)
   */
  async updateById(
    id: string,
    updateData: UpdateQuery<IProject>
  ): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    ).populate('userId', 'fullName email avatar_url');
  }

  /**
   * Delete project by ID
   */
  async deleteById(id: string): Promise<IProject | null> {
    return await Project.findByIdAndDelete(id);
  }

  /**
   * Check if project belongs to user (important for authorization)
   */
  async existsForUser(projectId: string, userId: string): Promise<boolean> {
    const project = await Project.findOne({ _id: projectId, userId });
    return !!project;
  }

  /**
   * Search projects (can be scoped to user)
   */
  async search(
    query: string,
    userId?: string,
    options: PaginateOptions = {}
  ): Promise<PaginateResult<IProject>> {
    const searchRegex = new RegExp(query, 'i');

    const filter: QueryFilter<IProject> = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    };

    if (userId) {
      filter.userId = userId;
    }

    return await this.findAll(filter, options);
  }

  /**
   * Update cover image
   */
  async updateCoverImage(
    id: string,
    coverImageUrl: string
  ): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(
      id,
      { coverImage: coverImageUrl },
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email avatar_url');
  }

  /**
   * Count projects for a user
   */
  async countByUserId(userId: string): Promise<number> {
    return await Project.countDocuments({ userId });
  }
}

// Export singleton
export const projectRepository = new ProjectRepository();
export default projectRepository;