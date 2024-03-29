import { type SandboxedJobProcessor } from 'bullmq';
import { isMainThread } from 'worker_threads';
import { getConnectedDataSource } from '../../database/connections/default';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import appConfig from '../../config/envs/app.config';
import PQueueClassType from 'p-queue';

const appConfigEnv = appConfig();
const processor: SandboxedJobProcessor = async (
  ...args: Parameters<SandboxedJobProcessor>
) => {
  if (appConfigEnv.STOP_BACKGROUND_SERVICE) {
    return;
  }

  try {
    const dataSource = await getConnectedDataSource();
    const entityManager = dataSource.manager;

    console.log('Before create app instance in sync worker');
    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      bufferLogs: true,
    });
    console.log('After create app instance in sync worker');
    console.log(`[${process.pid}]`, isMainThread);

    //Logic here...
  } catch (error) {
    console.log(error);
  }
};

export default processor;
