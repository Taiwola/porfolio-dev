import { asyncHandler } from "../common/asyncHandler";
import { Request, Response } from "express";
import UserRepository from "../repository/user.repository";
import { sendError, sendSuccess } from "../common/response";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../config/token";
import { sendForgotPassword } from "../mail";
import { ENV } from "../config/env.config";
import { AuthRequest } from "../middleware/auth.middleware";
import { mailQueue } from "../queues/mail.queue";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserRepository.findByEmail(email);

  if (!user) {
    return sendError(res, "Invalid credentials", 401);
  }

  const comparePassword = await UserRepository.comparePassword(
    user.id,
    password,
  );

  if (!comparePassword) {
    return sendError(res, "Invalid Credentials", 401);
  }

  const token = generateAccessToken({
    email: user.email,
    id: user._id.toString(),
    fullName: user.fullName,
    role: user.role,
  });

  const refreshToken = generateRefreshToken(user._id.toString());

  return sendSuccess(res, {
    accessToken: token,
    refreshToken,
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

export const forgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      return sendError(res, "Account does not exist", 404);
    }

    const resetLink =
      ENV.CLIENT_URL +
      "/reset-password?token=" +
      generateRefreshToken(user._id.toString());

    const { error, errorMessage } = await sendForgotPassword(
      user.email,
      user.fullName,
      resetLink,
    );

    if (error) {
      // log for debugging and add the mail to a queue for retrying later.
      await mailQueue.add("forgot_password", {
        type: "forgot_password",
        to: user.email,
        payload: { username: user.fullName, resetLink },
      });
      console.error("Failed to send forgot password email:", errorMessage);
    }

    return sendSuccess(res, null, "Password reset link sent to your email");
  },
);

export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { newPassword } = req.body;
    const userId = req.user?.id;

    const user = await UserRepository.findById(userId as string);
    if (!user) return sendError(res, "User does not exist", 404);
    await UserRepository.updatePassword(user?._id.toString(), newPassword);

    return sendSuccess(res, null, "Password reset successful");
  },
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, "Refresh token is required", 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return sendError(res, "Invalid or expired refresh token", 401);
    }

    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return sendError(res, "User no longer exists", 401);
    }

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return sendSuccess(res, { accessToken }, "Token refreshed successfully");
  },
);
