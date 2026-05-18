/**
 * Migration 008: Budget Profiles
 *
 * Why: Add budget_profiles collection and update budgets to support
 *      profile-linked groups (budgetProfileId, nullable month).
 * Safe to re-run: yes
 */

import type { MigrationDatabase } from './types';

export const name = '008_budget_profiles';
export const description = 'Create budget_profiles collection and update budgets schema';

export async function up(db: MigrationDatabase): Promise<void> {
  // Index on budget_profiles
  const profiles = db.collection('budget_profiles');
  await profiles.createIndex({ userId: 1 } as any);
  await profiles.createIndex({ userId: 1, status: 1 } as any);
  console.log('✓ budget_profiles: indexes created');

  // Add budgetProfileId field to existing budget documents (null = monthly budget)
  const budgets = db.collection('budgets');
  await budgets.createIndex({ budgetProfileId: 1 } as any, { sparse: true });
  await (budgets as any).updateMany(
    { budgetProfileId: { $exists: false } },
    { $set: { budgetProfileId: null } },
  );
  // Ensure periodType includes 'profile' — existing docs stay as monthly/oneTime
  console.log('✓ budgets: budgetProfileId field initialized');
}

export async function down(db: MigrationDatabase): Promise<void> {
  await db.collection('budget_profiles').drop().catch(() => {});
  await (db.collection('budgets') as any).updateMany({}, { $unset: { budgetProfileId: '' } });
  console.log('✓ Rolled back budget profiles migration');
}
