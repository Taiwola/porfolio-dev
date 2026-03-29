import { Redis } from 'ioredis';
import { ENV } from './env.config';

export const redisConnection = new Redis(ENV.REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
});