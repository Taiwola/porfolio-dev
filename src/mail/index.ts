import { sendMail, verifyTransporter } from "./mailer";
import { contactNotificationMail } from "./templates/contactNotification.mail";
import { ENV } from "../config/env.config";
import { adminReplyMail } from "./templates/adminReply.mail";
import { forgotPasswordMail } from "./templates/forgotPassword.mail";
import { passwordResetConfirmedMail } from "./templates/passwordResetConfirmed.mail";

export const sendContactNotification = async (
  sender: string,
  email: string,
  subject: string,
  body: string,
): Promise<{ error: boolean; errorMessage: string }> => {
  let verify: boolean;
  try {
    verify = await verifyTransporter();
  } catch (error: unknown) {
    console.log(error);
    return { error: true, errorMessage: (error as Error).message };
  }

  if (!verify) return { error: true, errorMessage: "" };
  const mail = contactNotificationMail(sender, email, subject, body);

  try {
    await sendMail({ to: ENV.MAIL_USER, ...mail });
    return { error: false, errorMessage: "" };
  } catch (error) {
    return { error: true, errorMessage: (error as Error).message };
  }
};

export const sendAdminReply = async (
  to: string,
  recipientName: string,
  replyBody: string,
  originalSubject: string,
): Promise<{ error: boolean; errorMessage: string }> => {
  let verify: boolean;
  try {
    verify = await verifyTransporter();
  } catch (error: unknown) {
    console.log(error);
    return { error: true, errorMessage: (error as Error).message };
  }

  if (!verify) return { error: true, errorMessage: "" };
  const mail = adminReplyMail(recipientName, replyBody, originalSubject);
  try {
    await sendMail({ to, ...mail });
    return { error: false, errorMessage: "" };
  } catch (error) {
    return { error: true, errorMessage: (error as Error).message };
  }
};

export const sendForgotPassword = async (
  to: string,
  username: string,
  resetUrl: string,
): Promise<{ error: boolean; errorMessage: string }> => {
  let verify: boolean;
  try {
    verify = await verifyTransporter();
  } catch (error: unknown) {
    console.log(error);
    return { error: true, errorMessage: (error as Error).message };
  }

  if (!verify) return { error: true, errorMessage: "" };
  const mail = forgotPasswordMail(username, resetUrl);
  try {
    await sendMail({ to, ...mail });
    return { error: false, errorMessage: "" };
  } catch (error) {
    return { error: true, errorMessage: (error as Error).message };
  }
};

export const sendPasswordResetConfirmed = async (
  to: string,
  username: string,
): Promise<{ error: boolean; errorMessage: string }> => {
  let verify: boolean;
  try {
    verify = await verifyTransporter();
  } catch (error: unknown) {
    console.log(error);
    return { error: true, errorMessage: (error as Error).message };
  }

  if (!verify) return { error: true, errorMessage: "" };
  const mail = passwordResetConfirmedMail(username);
  try {
    await sendMail({ to, ...mail });
    return { error: false, errorMessage: "" };
  } catch (error) {
    return { error: true, errorMessage: (error as Error).message };
  }
};
