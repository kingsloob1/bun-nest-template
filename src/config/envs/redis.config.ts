import { isString } from 'lodash-es';
import processEnvObj from '.';
import { registerAs } from '@nestjs/config';

const getConfig = () => {
  const scheme = processEnvObj.REDIS_SCHEME || 'redis';
  const host = processEnvObj.REDIS_HOST || '127.0.0.1';
  const port = processEnvObj.REDIS_PORT || '6379';
  let url = processEnvObj.REDIS_URL;

  if (!(url && isString(url))) {
    url = `${scheme}://${host}:${port}`;
  }

  return {
    scheme: processEnvObj.REDIS_SCHEME || 'redis',
    host: processEnvObj.REDIS_HOST,
    port: parseInt(String(processEnvObj.REDIS_PORT || '6379'), 10) || 6379,
    url,
    cacheTimeout: processEnvObj.CACHE_TIMEOUT || 360,
  };
};

export default registerAs('redis', getConfig);
