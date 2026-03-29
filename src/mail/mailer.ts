import nodemailer, { Transporter } from 'nodemailer';
import { ENV } from '../config/env.config';

export const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: true,
  auth: {
    user: ENV.MAIL_USER,
    pass: ENV.MAIL_PASS,
  },
});

export const verifyTransporter = async (): Promise<boolean> => {
  await transporter.verify();
  return true;
};

export const sendMail = async (mailOptions: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  await transporter.sendMail({
    from: `"DevPortfolio" <${ENV.MAIL_USER}>`,
    ...mailOptions,
  });
};