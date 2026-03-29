import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.config';

export interface MailJob {
  type: 'forgot_password' | 'contact_notification' | 'admin_reply' | 'password_reset_confirmed';
  to: string;
  payload: Record<string, string>;
}

export const mailQueue = new Queue<MailJob>('mail', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,                          // retry 3 times
    backoff: { type: 'exponential', delay: 5000 }, // wait 5s, 10s, 20s between retries
    removeOnComplete: true,
    removeOnFail: false,                  // keep failed jobs for inspection
  },
});