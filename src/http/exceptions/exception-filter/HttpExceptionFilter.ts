import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common';
import { HttpResponse } from '../../../shared/HttpResponse';
import { BaseAppException } from '../BaseAppException';
import { ModuleRef } from '@nestjs/core';
import { AppLogger } from '../../../shared/AppLogger';
import { ValidationAppException } from '../ValidationAppException';
import { get, isObject, isString, omit } from 'lodash-es';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private moduleRef: ModuleRef,
    private appLogger: AppLogger,
  ) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const httpResponse: HttpResponse = new HttpResponse(this.moduleRef);

    if (exception instanceof BaseAppException) {
      this.appLogger.logError(exception);

      if (exception instanceof ValidationAppException) {
        // You might need to modify sendException to handle this `errors` property
        return httpResponse.sendException(
          exception,
          request,
          response,
          exception.errors,
        );
      }

      const exceptionResponse = exception.getResponse();
      if (!exception.message) {
        if (isString(exceptionResponse)) {
          exception.message = exceptionResponse;
        }

        const message = get(exceptionResponse, 'message');
        if (isObject(exceptionResponse) && isString(message)) {
          exception.message = message;
        }
      }

      return httpResponse.sendException(
        exception,
        request,
        response,
        isObject(exceptionResponse) ? omit(exceptionResponse, ['message']) : {},
      );
    } else {
      this.appLogger.logError(exception);
      return httpResponse.sendNotHandledException(exception, request, response);
    }
  }
}
