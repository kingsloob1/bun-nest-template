import { registerAs } from '@nestjs/config';
import processEnvObj from '.';

const getAppConfig = () => {
  let nodeEnv = String(processEnvObj.NODE_ENV).toLowerCase();
  if (!['development', 'staging', 'production', 'test'].includes(nodeEnv)) {
    nodeEnv = 'development';
  }

  return {
    NODE_ENV: nodeEnv as
      | 'development'
      | 'staging'
      | 'production'
      | 'test'
      | 'local',
    PORT: parseInt(String(processEnvObj.PORT), 10) || 5011,
    INSTANCE_ID: processEnvObj.INSTANCE_ID,
    PROJECT_NAME: processEnvObj.PROJECT_NAME,
    APP_URL: processEnvObj.APP_URL,
    FRONTEND_URL: processEnvObj.FRONTEND_URL,
    APP_KEY: processEnvObj.APP_KEY,
    THROTTLE_TTL:
      parseInt(String(processEnvObj.THROTTLE_TTL || '60'), 10) || 60,
    THROTTLE_LIMIT:
      parseInt(String(processEnvObj.THROTTLE_LIMIT || '30'), 10) || 30,
    SENTRY_DSN: processEnvObj.SENTRY_DSN,
    SENTRY_ENV: processEnvObj.SENTRY_ENV,
    CACHE_TIMEOUT:
      parseInt(String(processEnvObj.CACHE_TIMEOUT || '30'), 10) || 30,
    JWT_SECRET: String(processEnvObj.SECRET) || 'JWT-SECRET',
    STOP_BACKGROUND_SERVICE: Boolean(processEnvObj.STOP_BACKGROUND_SERVICE),
  };
};

export default registerAs('app', getAppConfig);
