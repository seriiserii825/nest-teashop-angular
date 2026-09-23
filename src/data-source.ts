import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config.js';

const isCompiled = import.meta.url.endsWith('.js');
const root = isCompiled ? 'dist' : 'src';
const ext = isCompiled ? 'js' : 'ts';

export default new DataSource({
  ...databaseConfig,
  entities: [`${root}/**/*.entity.${ext}`],
  migrations: [`${root}/migrations/*.${ext}`],
});
