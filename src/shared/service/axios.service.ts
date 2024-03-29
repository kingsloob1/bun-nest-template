import axios, { type AxiosInstance } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import type {
  ErrorLogConfig,
  RequestLogConfig,
  ResponseLogConfig,
} from 'axios-logger/lib/common/types';
import * as AxiosLogger from 'axios-logger';
import { AppLogger } from '~/shared/AppLogger';
import appConfiguration from '~/config/envs/app.config';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class AxiosService {
  constructor(
    private readonly log: AppLogger,
    @Inject(appConfiguration.KEY)
    protected appConfig: ConfigType<typeof appConfiguration>,
  ) {}

  public createAxiosInstance({
    baseURL,
    headers,
    fallbackURL,
    timeout = 60 * 1000, //Set default to 1 minute
    registerRequestInterceptors = true,
    registerResponseInterceptors = true,
  }: {
    baseURL?: string;
    headers?: Record<string, string>;
    fallbackURL: string;
    timeout?: number;
    registerRequestInterceptors?: boolean;
    registerResponseInterceptors?: boolean;
  }): AxiosInstance {
    if (!baseURL) {
      this.log.logInfo(
        `Base URL not specified. Using fallback: ${fallbackURL}`,
      );
    }
    const instance = axios.create({
      baseURL: baseURL || fallbackURL,
      headers,
      timeout,
    });

    this.registerInterceptors(
      instance,
      Boolean(registerRequestInterceptors),
      Boolean(registerResponseInterceptors),
    );

    return instance;
  }

  private registerInterceptors(
    instance: AxiosInstance,
    registerRequest = true,
    registerResponse = true,
  ) {
    const axiosLoggerRequestConfig: RequestLogConfig = {
      dateFormat: 'dddd, mmmm dS, yyyy, h:MM:ss TT',
      params: true,
      headers: true,
      data: true,
      method: true,
      url: true,
    };

    const axiosLoggerResponseConfig: ResponseLogConfig | ErrorLogConfig = {
      data: true,
      status: true,
      statusText: true,
    };

    if (registerRequest) {
      // Add request interceptors
      instance.interceptors.request.use(
        (request) => {
          AxiosLogger.requestLogger(request, axiosLoggerRequestConfig);
          return request;
        },
        (err) => AxiosLogger.errorLogger(err, axiosLoggerResponseConfig),
      );
    }

    if (registerResponse) {
      // Add response interceptors
      instance.interceptors.response.use(
        (r) => AxiosLogger.responseLogger(r, axiosLoggerRequestConfig),
        (e) => AxiosLogger.errorLogger(e, axiosLoggerResponseConfig),
      );
    }
  }
}
