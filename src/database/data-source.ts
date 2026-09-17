import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * TypeORM CLI data source (migrations only).
 * App runtime uses TypeOrmModule.forRootAsync in AppModule.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
