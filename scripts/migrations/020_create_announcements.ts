import { MigrationDatabase } from './types';

export const name = '020_create_announcements';
export const description = 'Create announcements collection with indexes';

export const up = async (db: MigrationDatabase) => {
  const col = db.collection('announcements');
  await col.createIndex({ publishedAt: -1 });
  await col.createIndex({ published: 1, publishedAt: -1 });
};

export const down = async (db: MigrationDatabase) => {
  await db.collection('announcements').drop().catch(() => {});
};
