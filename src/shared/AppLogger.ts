import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class AppLogger {
  logError(exception: Error | unknown) {
    const nodeEnv = process.env.NODE_ENV || 'local';
    if (nodeEnv === 'development') {
      console.error(exception);
    } else {
      console.error(exception);

      Sentry.captureException(exception);
    }
  }

  logInfo(...info: any) {
    const nodeEnv = process.env.NODE_ENV || 'local';
    if (nodeEnv === 'development') {
      console.info(info);
    } else {
      console.log(info);
    }
  }
}
