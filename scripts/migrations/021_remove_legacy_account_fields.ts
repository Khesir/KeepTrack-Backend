/**
 * Migration 021: Remove legacy accountId/toAccountId fields
 *
 * Why: Migration 003 dropped the 'accounts' collection in favour of savings
 *      buckets, but accountId/toAccountId fields referencing that collection
 *      were left on budgets, debts, month_plans, planned_payments and
 *      transactions. They are never populated by the app — this removes the
 *      dead pointers.
 * Safe to re-run: yes ($unset on a missing field is a no-op)
 */

import type { MigrationDatabase } from './types';

export const name = '021_remove_legacy_account_fields';
export const description = 'Unset legacy accountId/toAccountId fields from finance collections';

export async function up(db: MigrationDatabase): Promise<void> {
  await db.collection('budgets').updateMany({}, { $unset: { accountId: '' } });
  await db.collection('debts').updateMany({}, { $unset: { accountId: '' } });
  await db.collection('month_plans').updateMany({}, { $unset: { accountId: '' } });
  await db.collection('planned_payments').updateMany({}, { $unset: { accountId: '' } });
  await db.collection('transactions').updateMany({}, { $unset: { accountId: '', toAccountId: '' } });
  console.log('✓ Removed legacy accountId/toAccountId fields');
}

export async function down(db: MigrationDatabase): Promise<void> {
  console.log('⚠ No-op — legacy accountId/toAccountId fields are not restored');
}
