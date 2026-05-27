/**
 * Migration 007: Link goals to savings buckets
 *
 * Why: Goals now require a savingsBucketId to track which savings bucket
 *      funds the goal. Contributing to a goal deposits into the bucket;
 *      withdrawing decrements both.
 * Safe to re-run: yes (createIndex is idempotent, updateMany is conditional)
 */

import type { MigrationDatabase } from './types';

export const name = '007_goal_savings_link';
export const description = 'Add savingsBucketId field to goals collection and create index';

export async function up(db: MigrationDatabase): Promise<void> {
  const goals = db.collection('goals');

  // Add savingsBucketId index (sparse — only indexes docs that have the field)
  await goals.createIndex({ savingsBucketId: 1 } as any, { sparse: true });

  // Set savingsBucketId to null on any existing goals that don't have it
  await (goals as any).updateMany(
    { savingsBucketId: { $exists: false } },
    { $set: { savingsBucketId: null } },
  );

  console.log('✓ Goals: savingsBucketId field initialized and indexed');
}

export async function down(db: MigrationDatabase): Promise<void> {
  const goals = db.collection('goals');
  await goals.dropIndex('savingsBucketId_1').catch(() => {});
  await (goals as any).updateMany({}, { $unset: { savingsBucketId: '' } });
  console.log('✓ Goals: savingsBucketId removed');
}
