import { Queue } from 'bullmq';
import redisConfig from 'config/envs/redis.config';

export enum SYNC_QUEUE_ENUM {
  QUEUE_NAME = 'sync',
  PROCESS_SYNCED_WEBHOOKS_JOB = 'process_synced_webhook',
}

const redisConfiguration = redisConfig();
export default new Queue(SYNC_QUEUE_ENUM.QUEUE_NAME, {
  connection: {
    port: redisConfiguration.port,
    host: redisConfiguration.host,
  },
});
