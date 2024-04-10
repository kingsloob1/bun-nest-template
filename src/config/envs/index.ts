// import { config } from 'dotenv';

export type ProcessEnv = {
  NODE_ENV: 'development' | 'staging' | 'production' | 'test';
  PORT: number;
  PROJECT_NAME: string;
  APP_KEY: string;
  APP_URL: string;
  FRONTEND_URL: string;
  INSTANCE_ID: string;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  REDIS_URL?: string;
  REDIS_SCHEME?: 'redis' | 'rediss';
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  MAX_AUTH_FAILURE_BEFORE_BLACKLIST: number;
  CAPTCHA_SECRET: string;
  CAPTCHA_MINIMUM_EXPECTED_SCORE: number;
  FILE_CHUNK_PARTITION_SIZE: number;
  AWS_S3_BUCKET: string;
  AWS_S3_BUCKET_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER_NAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_CONN_POOL_COUNT: number;
  DB_CONNREDIS_PORT_POOL_COUNT: number;
  SMTP_PASSWORD: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_HOST: string;
  SMTP_SERVICE: string;
  SENTRY_DSN: string;
  SENTRY_ENV: string;
  STOP_BACKGROUND_SERVICE: string;
  CACHE_TIMEOUT: string;
  SECRET: string;
  DEFAULT_PER_PAGE: string | undefined;
  FULL_SITE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRY: string;
};

// config({
//   path: path.join(process.cwd(), '.env'),
// });

const processEnvObj = process.env as unknown as ProcessEnv;
if (
  !processEnvObj.REDIS_SCHEME ||
  !['redis', 'rediss'].includes(processEnvObj.REDIS_SCHEME)
) {
  processEnvObj.REDIS_SCHEME = 'redis';
}

export default processEnvObj;
