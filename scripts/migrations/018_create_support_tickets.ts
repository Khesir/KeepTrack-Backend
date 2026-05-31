import { MigrationDatabase } from './types';

export const name = '018_create_support_tickets';
export const description = 'Create support_tickets collection with status and date indexes';

export const up = async (db: MigrationDatabase) => {
  const col = db.collection('support_tickets');
  await col.createIndex({ status: 1, createdAt: -1 });
};

export const down = async (db: MigrationDatabase) => {
  await db.collection('support_tickets').drop().catch(() => {});
};
