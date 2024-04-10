import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService, type ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { TranslateModule } from 'nestjs-translate';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './http/exceptions/exception-filter/HttpExceptionFilter';
import { CacheModule, type CacheStore } from '@nestjs/cache-manager';
import { getConnectedDataSource as getDefaultConnectionDataSource } from './database/connections/default';
import {
  ThrottlerModule,
  type ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './config/throttle';
import validatorPipe from './config/validator';
import appConfig from './config/envs/app.config';
import databaseConfig from './config/envs/database.config';
import redisConfig from './config/envs/redis.config';
import { SharedModule } from './shared/shared.module';
import { pathFromSrc } from './utils/general';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configSrv: ConfigService) => {
        const redisConfiguration = redisConfig();

        return {
          store: (await redisStore({
            url: redisConfiguration.url,
            ttl: configSrv.get('CACHE_TIMEOUT') || 360,
          })) as unknown as CacheStore,
          url: redisConfiguration.url,
          ttl: configSrv.get('CACHE_TIMEOUT') || 360,
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', `${process.env.NODE_ENV}.env`, 'local.env'],
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig],
      cache: true,
    }),
    LoggerModule.forRootAsync({
      inject: [appConfig.KEY],
      async useFactory(applicationConfig: ConfigType<typeof appConfig>) {
        const nodeEnv = applicationConfig.NODE_ENV;

        const pinoPrettyOptions = {
          singleLine: true,
        };

        return {
          pinoHttp: {
            serializers: {
              req(req) {
                req.body = req.body || req.raw.body;
                return req;
              },
              res(res) {
                return {
                  statusCode: res.statusCode,
                  body: res.body || res['saved-body'] || null,
                };
              },
            },
            transport: {
              target: 'pino-pretty',
              options:
                nodeEnv === 'production'
                  ? pinoPrettyOptions
                  : {
                      ...pinoPrettyOptions,
                      colorize: true,
                    },
            },
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        const dataSourceInstance = await getDefaultConnectionDataSource();
        return dataSourceInstance;
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return [
          {
            ttl: config.get('app.THROTTLE_TTL') as number,
            limit: config.get('app.THROTTLE_LIMIT') as number,
          },
        ] as ThrottlerModuleOptions;
      },
    }),
    TranslateModule.forRoot({
      defaultLang: 'en',
      prefix: pathFromSrc('i18n'),
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_PIPE,
      useValue: validatorPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply((req, res, next) => {
    //     console.log('req url is =====> ', req.url);
    //     next();
    //   })
    //   .forRoutes({ path: 'api/v1/test/*', method: RequestMethod.ALL });
  }
}
