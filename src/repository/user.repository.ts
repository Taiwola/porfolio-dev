 // Make sure path is correct
import { QueryOptions, QueryFilter, UpdateQuery } from "mongoose";
import User, { IUser } from "../model/users.model";

export const UserRepository = {
  /**
   * Find all users with pagination, filtering, and sorting
   */
  findAll: async (
    query: QueryFilter<IUser> = {},
    options: QueryOptions = {}
  ) => {
    const { page = 1, limit = 10, sort = { createdAt: -1 }, ...restOptions } = options;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .select("-password")           
        .lean(),                       
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: Number(page) < Math.ceil(total / limit),
        hasPrev: Number(page) > 1,
      },
    };
  },

  /**
   * Find one user by ID
   */
  findById: async (id: string) => {
    return User.findById(id)
      .select("-password")
      .lean();
  },

  /**
   * Find one user by email (useful for login)
   */
  findByEmail: async (email: string) => {
    return User.findOne({ email: email.toLowerCase() });
  },

  /**
   * Create a new user
   */
  create: async (userData: Partial<IUser>) => {
    const user = await User.create(userData);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  },

  /**
   * Update user by ID
   */
  updateById: async (id: string, updateData: UpdateQuery<IUser>) => {
    return User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password").lean();
  },

  /**
   * Delete user by ID
   */
  deleteById: async (id: string) => {
    return User.findByIdAndDelete(id);
  },

  /**
   * Update password (uses your updatePassword method)
   */
  updatePassword: async (userId: string, newPassword: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.updatePassword(newPassword);
    return { message: "Password updated successfully" };
  },

  /**
   * Check if email already exists
   */
  emailExists: async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email: email.toLowerCase() });
    return !!user;
  },


  /**
   * Compare user password (Better to keep this as instance method)
   * This method is usually called on a user document, not in repository like this.
   * Keeping it for now but recommend using user.comparePassword() directly.
   */
  comparePassword: async (userId: string, candidatePassword: string): Promise<boolean> => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    return user.comparePassword(candidatePassword);
  },
};

export default UserRepository;