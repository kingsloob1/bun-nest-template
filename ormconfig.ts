import { type DataSourceOptions } from 'typeorm';
import dbConfig from './src/config/envs/database.config';
import { join } from 'node:path';

const pathFromSrc = (path: string) => {
  return join(import.meta.dirname, './src', path);
};

const defaultConfiguration = dbConfig();
const defaultDataSourceOptions: DataSourceOptions = {
  applicationName: 'marketing-ecommerce',
  name: 'default',
  type: 'postgres',
  ...{
    ...defaultConfiguration,
  },
  synchronize: false,
  // logging: ['error', 'warn', 'log'],
  logging: 'all',
  // logger: 'advanced-console',
  logger: 'file',
  entities: [pathFromSrc('database/models/*.{js,ts}')],
  migrations: [pathFromSrc('database/migrations/*.{js,ts}')],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  useUTC: true,
  connectTimeoutMS: 10000,
  dropSchema: false,
  migrationsTransactionMode: 'all',
  metadataTableName: 'typeorm_metadata',
  maxQueryExecutionTime: 15000,
  installExtensions: true,
  logNotifications: true,
  ssl: false,
  extra: {
    max: defaultConfiguration.maxPoolConnCount,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
  cache: {
    type: 'database',
    tableName: 'typeorm_cache_table',
  },
};
export default defaultDataSourceOptions;
