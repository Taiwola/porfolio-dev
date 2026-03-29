import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.config';
import { MailJob } from './mail.queue';
import {
  sendForgotPassword,
  sendContactNotification,
  sendAdminReply,
  sendPasswordResetConfirmed,
} from '../mail';

export const mailWorker = new Worker<MailJob>(
  'mail',
  async (job) => {
    const { type, to, payload } = job.data;

    switch (type) {
      case 'forgot_password':
        await sendForgotPassword(to, payload.username!, payload.resetUrl!);
        break;
      case 'contact_notification':
        await sendContactNotification(payload.sender!, to, payload.subject!, payload.body!);
        break;
      case 'admin_reply':
        await sendAdminReply(to, payload.recipientName!, payload.replyBody!, payload.originalSubject!);
        break;
      case 'password_reset_confirmed':
        await sendPasswordResetConfirmed(to, payload.username!);
        break;
      default:
        throw new Error(`Unknown mail job type: ${type}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

mailWorker.on('completed', (job) => {
  console.log(`Mail job ${job.id} (${job.data.type}) sent to ${job.data.to}`);
});

mailWorker.on('failed', (job, error) => {
  console.error(`Mail job ${job?.id} failed after ${job?.attemptsMade} attempts:`, error.message);
});