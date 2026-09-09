import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config.js';

export default new DataSource({
  ...databaseConfig,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
