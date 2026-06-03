import type { MigrationDatabase } from './types';

export const name = '019_add_is_plus';
export const description = 'Backfill isPlus: false on all existing users';

export async function up(db: MigrationDatabase): Promise<void> {
  await db.collection('users').updateMany(
    { isPlus: { $exists: false } },
    { $set: { isPlus: false } },
  );
}

export async function down(db: MigrationDatabase): Promise<void> {
  await db.collection('users').updateMany({}, { $unset: { isPlus: '' } });
}
