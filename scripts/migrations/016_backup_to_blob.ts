import { MigrationDatabase } from './types';

export const name = '016_backup_to_blob';
export const description = 'Drop inline data field from backups; backup content now stored in Vercel Blob';

export const up = async (db: MigrationDatabase) => {
  const col = db.collection('backups');
  await col.updateMany(
    { data: { $exists: true } },
    { $unset: { data: '' } },
  );
};

export const down = async (db: MigrationDatabase) => {
  // No-op: inline data cannot be restored from blob in a migration
};
