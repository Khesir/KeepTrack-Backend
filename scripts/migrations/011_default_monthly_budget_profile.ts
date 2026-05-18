/**
 * Migration 011: Create a default "Monthly Budget" profile per user and link
 * all unscoped budgets (budgetProfileId == null) to it.
 *
 * Why: The main monthly budget had no profileId, requiring null-checks and
 *      sentinel values throughout the codebase. Every budget now belongs to
 *      a named profile so the UI can treat them uniformly.
 * Safe to re-run: yes — guards against duplicate creation and skips already-linked budgets.
 */

import type { MigrationDatabase } from './types';

export const name = '011_default_monthly_budget_profile';
export const description = 'Create default Monthly Budget profile per user and link unscoped budgets to it';

export async function up(db: MigrationDatabase): Promise<void> {
  const profiles = db.collection('budget_profiles');
  const budgets = db.collection('budgets');

  // Find all unscoped budgets grouped by userId
  const unscopedBudgets = await (budgets as any)
    .find({ budgetProfileId: { $in: [null, undefined] } })
    .toArray();

  if (unscopedBudgets.length === 0) {
    console.log('✓ No unscoped budgets found — nothing to migrate');
    return;
  }

  // Deduplicate userIds — keep raw ObjectId values from documents
  const seen = new Set<string>();
  const uniqueUserIds: any[] = [];
  for (const b of unscopedBudgets) {
    const key = b.userId.toString();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueUserIds.push(b.userId);
    }
  }

  for (const userId of uniqueUserIds) {
    // Check if a "Monthly Budget" profile already exists for this user
    const existing = await (profiles as any).findOne({
      userId,
      name: 'Monthly Budget',
      profileType: 'monthly',
    });

    let profileId: any;

    if (existing) {
      profileId = existing._id;
      console.log(`  ↳ User ${userId}: reusing existing Monthly Budget profile`);
    } else {
      const result = await (profiles as any).insertOne({
        userId,
        name: 'Monthly Budget',
        description: null,
        startDate: null,
        endDate: null,
        colorHex: null,
        status: 'active',
        profileType: 'monthly',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      profileId = result.insertedId;
      console.log(`  ↳ User ${userId}: created Monthly Budget profile ${profileId}`);
    }

    // Link all unscoped budgets for this user to the new profile
    const updateResult = await (budgets as any).updateMany(
      { userId, budgetProfileId: { $in: [null, undefined] } },
      { $set: { budgetProfileId: profileId } },
    );
    console.log(`  ↳ User ${userId}: linked ${updateResult.modifiedCount} budgets`);
  }

  console.log('✓ Default Monthly Budget profiles created and budgets linked');
}

export async function down(db: MigrationDatabase): Promise<void> {
  const profiles = db.collection('budget_profiles');
  const budgets = db.collection('budgets');

  const monthlyProfiles = await (profiles as any)
    .find({ name: 'Monthly Budget', profileType: 'monthly' })
    .toArray();

  for (const profile of monthlyProfiles) {
    await (budgets as any).updateMany(
      { budgetProfileId: profile._id },
      { $set: { budgetProfileId: null } },
    );
    await (profiles as any).deleteOne({ _id: profile._id });
  }

  console.log('✓ Rolled back default Monthly Budget profiles');
}
