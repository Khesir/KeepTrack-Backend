/**
 * Migration 014: Create backups collection index
 *
 * Why: New encrypted backup feature stores one blob per user.
 *      Unique index on userId enforces one-backup-per-user at the DB level.
 * Safe to re-run: yes — createIndex is idempotent
 */

import type { MigrationDatabase } from './types';

export const name = '014_create_backup_index';
export const description = 'Create unique index on backups collection for userId';

export async function up(db: MigrationDatabase): Promise<void> {
  const backups = db.collection('backups');
  await backups.createIndex({ userId: 1 } as any, { unique: true });
  console.log('✓ Indexed backups');
}

export async function down(db: MigrationDatabase): Promise<void> {
  try {
    await db.collection('backups').drop();
  } catch {
    // Collection may not exist
  }
  console.log('✓ Rolled back migration 014');
}
