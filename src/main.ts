import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as Sentry from '@sentry/node';
import { getConnectedDataSource } from './database/connections/default';
import { useContainer } from 'class-validator';
import { BunHttpAdapter } from '@kingsleyweb/bun-nest';
import appConfig from './config/envs/app.config';
import type { BunRequest, BunResponse, NextFunction } from '@kingsleyweb/bun-common';
import type { HttpServer } from '@nestjs/common';
// import { GoogleSheetsService } from './sheet/services/google-sheet.service';
// import { SubscriberModel } from './database/models/SubscriberModel';
// import { SyncQueueService } from './queue/services/SyncQueue.service';

async function bootstrap() {
  try {
    console.log('Connecting to database ...');
    //Ensure database is connected before starting the app
    /*const dataSource = */ await getConnectedDataSource();
    console.log('Connected to database ...');

    //Get app instance
    const app = await NestFactory.create(AppModule, new BunHttpAdapter(60 * 1000), {
      rawBody: true,
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      bufferLogs: true,
      abortOnError: true,
      forceCloseConnections: true,
    });

    //Register loggers
    // const logger = app.get(Logger);
    // app.useGlobalInterceptors(new LoggerErrorInterceptor());
    // app.useLogger(logger);
    // app.flushLogs();

    //Get app config
    const appConfigEnv = appConfig();

    //Ensable cors
    app.enableCors({
      allowedHeaders: '*',
      origin: '*',
      methods: '*',
      exposedHeaders: [],
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    //TODO: Incrase paylaod size here default payload sizse is 5mb
    const config = new DocumentBuilder()
      .setTitle('Slide Marketing')
      .setDescription('Slide Marketing')
      .setVersion('1.0')
      .setBasePath('/marketing')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        docExpansion: 'none', // Set the initial expand level of the documentation (none, list, full)
        filter: true, // Enable filtering of API endpoints
        showRequestDuration: true, // Show the duration of API requests
        operationsSorter: 'alpha', // Sort the API endpoints alphabetically
        tagsSorter: 'alpha', // Sort the tags alphabetically
        validatorUrl: null, // Disable the default schema validator URL
        plugins: [import.meta.resolveSync('config/swagger/plugins/swagger-download.plugin.js')],
      },
    });

    (app.getHttpAdapter() as HttpServer<BunRequest, BunResponse, NextFunction>).get('/', (req, res) => {
      return res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Server is up and running',
      });
    });

    const envsToReportOn = ['staging', 'production'];
    if (envsToReportOn.includes(appConfigEnv.NODE_ENV)) {
      Sentry.init({
        dsn: appConfigEnv.SENTRY_DSN,
        environment: appConfigEnv.SENTRY_ENV,
      });
    }

    await app.listen(appConfigEnv.PORT, '0.0.0.0');
    const httpAdapter = await (app.getHttpAdapter() as unknown as BunHttpAdapter);
    const serverAddress = await httpAdapter.getListenAddress()
    const serverUrl = await app.getUrl();
    
    if (httpAdapter && serverAddress && serverUrl) {
      console.log('App listened succesfully');
      console.log('Server opened connection on ====> ', serverUrl);
    } else {
      console.log('Could not start application');
      process.exit(0);
    }
  } catch (e) {
    console.log('error is ====> ', e);
    process.exit();
  }
}

bootstrap();
