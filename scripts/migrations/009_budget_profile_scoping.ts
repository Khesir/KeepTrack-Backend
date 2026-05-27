/**
 * Migration 009: Budget profile scoping
 *
 * Adds budgetProfileId to month_plans, subscriptions, debts, goals so data
 * can be isolated per custom budget profile.
 * Also rebuilds the month_plans unique index to support both monthly and
 * profile-scoped plans.
 *
 * Safe to re-run: yes
 */

import type { MigrationDatabase } from './types';

export const name = '009_budget_profile_scoping';
export const description = 'Add budgetProfileId to month_plans, subscriptions, debts, goals';

export async function up(db: MigrationDatabase): Promise<void> {
  // ── month_plans ────────────────────────────────────────────────────────────
  const plans = db.collection('month_plans');

  // Drop the old unique index (userId + month) so we can replace it
  try {
    await plans.dropIndex('userId_1_month_1');
  } catch (_) {
    // Index may not exist or already dropped — safe to ignore
  }

  // Sparse unique on (userId, month) — only indexes monthly plans
  await plans.createIndex(
    { userId: 1, month: 1 } as any,
    { unique: true, sparse: true, name: 'userId_month_unique_sparse' },
  );

  // Sparse unique on (userId, budgetProfileId) — only indexes profile plans
  await plans.createIndex(
    { userId: 1, budgetProfileId: 1 } as any,
    { unique: true, sparse: true, name: 'userId_budgetProfileId_unique_sparse' },
  );

  console.log('✓ Rebuilt month_plans indexes');

  // ── subscriptions ──────────────────────────────────────────────────────────
  const subs = db.collection('subscriptions');
  await subs.createIndex({ budgetProfileId: 1 } as any);
  console.log('✓ Indexed subscriptions.budgetProfileId');

  // ── debts ──────────────────────────────────────────────────────────────────
  const debts = db.collection('debts');
  await debts.createIndex({ budgetProfileId: 1 } as any);
  console.log('✓ Indexed debts.budgetProfileId');

  // ── goals ──────────────────────────────────────────────────────────────────
  const goals = db.collection('goals');
  await goals.createIndex({ budgetProfileId: 1 } as any);
  console.log('✓ Indexed goals.budgetProfileId');
}

export async function down(db: MigrationDatabase): Promise<void> {
  const plans = db.collection('month_plans');
  try { await plans.dropIndex('userId_month_unique_sparse'); } catch (_) {}
  try { await plans.dropIndex('userId_budgetProfileId_unique_sparse'); } catch (_) {}
  await plans.createIndex({ userId: 1, month: 1 } as any, { unique: true });
}
