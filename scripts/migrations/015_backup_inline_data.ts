import { MigrationDatabase } from './types';

export const name = '015_backup_inline_data';
export const description = 'Rename blobUrl to data on backups collection; drop blobUrl field';

export const up = async (db: MigrationDatabase) => {
  const col = db.collection('backups');
  await col.updateMany(
    { blobUrl: { $exists: true }, data: { $exists: false } },
    { $rename: { blobUrl: 'data' } },
  );
  await col.updateMany(
    { blobUrl: { $exists: true } },
    { $unset: { blobUrl: '' } },
  );
};

export const down = async (db: MigrationDatabase) => {
  const col = db.collection('backups');
  await col.updateMany(
    { data: { $exists: true } },
    { $rename: { data: 'blobUrl' } },
  );
};
