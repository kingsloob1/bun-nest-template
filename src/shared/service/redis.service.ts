import { Injectable } from '@nestjs/common';
import { AppLogger } from '~/shared/AppLogger';
import redisConfig from '../../config/envs/redis.config';
import { isNull, isString } from 'lodash-es';
import stringify from 'json-stringify-safe';
import isNumeric from 'fast-isnumeric';
import { number } from 'mathjs';
import { Redis } from 'ioredis';
import RedlockClassType from 'redlock';

@Injectable()
export class RedisService {
  private ioRedisClient: Redis | undefined = undefined;

  constructor(private readonly log: AppLogger) {
    this.createIoRedisClient();
  }

  private createIoRedisClient() {
    if (this.ioRedisClient) {
      return this.ioRedisClient;
    }

    const config = redisConfig();
    this.ioRedisClient = new Redis({
      host: config.host || '127.0.0.1',
      port: config.port || 6379,
    });

    return this.ioRedisClient;
  }

  public async getIoRedisClient() {
    return this.createIoRedisClient();
  }

  public async lock(name: string, timeout = 5000) {
    const { default: Redlock } = await eval(`import('redlock')`);
    const redlock = new Redlock([await this.getIoRedisClient()], {
      driftFactor: 0.01,
      retryCount: 0,
      retryDelay: 200,
      retryJitter: 200,
      automaticExtensionThreshold: 1000,
    }) as RedlockClassType;

    console.log('After initializing redlock, Before lock request ======> ');

    try {
      const resp = await redlock.acquire([name], timeout);
      return resp;
    } catch (e) {
      console.log('error acquiring lock =====> ', e);
      return false;
    }
  }

  public async getParsedData<R>(
    key: string,
    defaultVal: R | undefined = undefined,
    parse = true,
  ): Promise<R | undefined> {
    const client = await this.getIoRedisClient();
    const data = await client.get(key);

    if (!isNull(data)) {
      if (!parse) {
        return data as unknown as R;
      } else if (isString(data)) {
        try {
          return JSON.parse(data) as R;
        } catch {
          //
        }
      }
    }

    return defaultVal;
  }

  public async setData(
    key: string,
    value: unknown,
    expireAfter: number | string | undefined = undefined, //In seconds
  ): Promise<boolean> {
    const client = await this.getIoRedisClient();
    const stringifiedValue = stringify(value);
    const setDataResp = isNumeric(expireAfter)
      ? await client.set(key, stringifiedValue, 'EX', number(expireAfter))
      : await client.set(key, stringifiedValue);

    return setDataResp === 'OK';
  }
}
