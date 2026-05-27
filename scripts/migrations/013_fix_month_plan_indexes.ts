/**
 * Migration 013: Fix month_plans unique indexes
 *
 * Why: The old sparse unique indexes on { userId, month } and { userId, budgetProfileId }
 *      treat explicit `null` as a real value. Creating a second profile plan (month: null)
 *      causes E11000 dup-key on { userId, month: null }. Replacing with partial-filter-expression
 *      indexes that only enforce uniqueness when the field has an actual value.
 * Safe to re-run: yes — createIndex is idempotent; dropIndex is guarded by try/catch.
 */

import type { MigrationDatabase } from './types';

export const name = '013_fix_month_plan_indexes';
export const description =
  'Replace sparse unique indexes on month_plans with partial-filter-expression indexes to fix profile plan dup-key errors';

export async function up(db: MigrationDatabase): Promise<void> {
  const col = db.collection('month_plans');

  // Drop the old sparse indexes (names may vary depending on how Mongoose named them)
  const tryDrop = async (name: string) => {
    try { await col.dropIndex(name); } catch { /* already gone */ }
  };

  await tryDrop('userId_month_unique_sparse');
  await tryDrop('userId_budgetProfileId_unique_sparse');
  // Also drop any auto-named variants Mongoose may have created
  await tryDrop('userId_1_month_1');
  await tryDrop('userId_1_budgetProfileId_1');

  // Create partial-filter-expression unique indexes
  await col.createIndex(
    { userId: 1, month: 1 },
    {
      unique: true,
      name: 'userId_month_unique',
      partialFilterExpression: { month: { $type: 'string' } },
    },
  );

  await col.createIndex(
    { userId: 1, budgetProfileId: 1 },
    {
      unique: true,
      name: 'userId_budgetProfileId_unique',
      partialFilterExpression: { budgetProfileId: { $type: 'objectId' } },
    },
  );
}

export async function down(db: MigrationDatabase): Promise<void> {
  const col = db.collection('month_plans');

  try { await col.dropIndex('userId_month_unique'); } catch { /* */ }
  try { await col.dropIndex('userId_budgetProfileId_unique'); } catch { /* */ }

  await col.createIndex({ userId: 1, month: 1 }, { unique: true, sparse: true });
  await col.createIndex({ userId: 1, budgetProfileId: 1 }, { unique: true, sparse: true });
}
