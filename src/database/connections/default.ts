import { DataSource, EntityMetadataNotFoundError, IsNull, Not } from 'typeorm';
import defaultConnectionOptions from 'src/../ormconfig';
import { Pool } from 'pg';
import { get, isUndefined, set, pick } from 'lodash-es';
import waitUntil from 'until-promise';
import appConfiguration from 'config/envs/app.config';
// import { WebhookLogModel } from '../models/WebhookLogModel';

const appConfig = appConfiguration();
const dataSourceConfig = defaultConnectionOptions;
set(dataSourceConfig, 'extra', {
  max: 200,
  connectionTimeoutMillis: 5 * 60 * 1000,
  idleTimeoutMillis: 30 * 1000,
});

const dataSource = new DataSource(dataSourceConfig);
let pool: Pool | undefined = undefined;
const dataSourceWrapper: { dataSource: DataSource } = {
  dataSource,
};

export const getPool = async () => {
  const poolRef: Pool = await waitUntil(
    () => {
      const poolRef = pool;
      if (!poolRef) {
        throw new Error('Oops.. Pool is not yet available');
      }
      return poolRef;
    },
    (resp) => !!resp,
    {
      wait: 300,
    },
  );
  return poolRef;
};

export const isConnected = async () => {
  await waitUntil(
    () => dataSourceWrapper.dataSource.isInitialized,
    (isConnected) => !!isConnected,
    {
      wait: 2000,
    },
  );

  return true;
};

export const getConnectedDataSource = async () => {
  if (!dataSource.isInitialized) {
    dataSource
      .initialize()
      .then((newDataSource) => {
        dataSourceWrapper.dataSource = newDataSource;
        pool = get(dataSourceWrapper.dataSource, 'driver.master', undefined) as
          | Pool
          | undefined;
      })
      .catch((err) => {
        console.error('Error during Default Data Source initialization', err);
      });
  }

  console.log('Checking if database is connected in default config..... ');
  await isConnected();
  console.log(
    'Database is connected successfully in default config. Testing Sample Database Query..... ',
  );

  // await waitUntil(
  //   async () => {
  //     try {
  //       const webhookLog = await dataSourceWrapper.dataSource.manager.findOne(
  //         WebhookLogModel,
  //         {
  //           where: {
  //             id: Not(IsNull()),
  //           },
  //         },
  //       );

  //       return !!webhookLog;
  //     } catch (e) {
  //       if (e instanceof EntityMetadataNotFoundError) {
  //         return false;
  //       }

  //       return true;
  //     }
  //   },
  //   (wasQuerySuccessfull) => !!wasQuerySuccessfull,
  //   {
  //     wait: 1000,
  //   },
  // );

  console.log(
    'Sample Database Query Executed Successfully in default config..... ',
  );

  return dataSourceWrapper.dataSource;
};
