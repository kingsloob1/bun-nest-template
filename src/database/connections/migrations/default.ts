import { DataSource } from 'typeorm';
import defaultConnectionOptions from 'src/../ormconfig';

const dataSourceConfig = defaultConnectionOptions;
const dataSource = new DataSource(dataSourceConfig);
export default dataSource;
