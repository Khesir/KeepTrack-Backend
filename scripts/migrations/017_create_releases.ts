import { MigrationDatabase } from './types';

export const name = '017_create_releases';
export const description = 'Create releases collection with publishedAt index';

export const up = async (db: MigrationDatabase) => {
  const col = db.collection('releases');
  await col.createIndex({ publishedAt: -1 });
  await col.createIndex({ published: 1, publishedAt: -1 });
};

export const down = async (db: MigrationDatabase) => {
  await db.collection('releases').drop().catch(() => {});
};
