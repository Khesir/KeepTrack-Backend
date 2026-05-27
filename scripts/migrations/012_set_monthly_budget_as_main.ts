/**
 * Migration 012: Set the Monthly Budget profile as isMain for each user.
 * Safe to re-run: yes — only updates if isMain is not already set.
 */
import type { MigrationDatabase } from './types';

export const name = '012_set_monthly_budget_as_main';
export const description = 'Set isMain=true on Monthly Budget profiles';

export async function up(db: MigrationDatabase): Promise<void> {
  const profiles = db.collection('budget_profiles');

  // Backfill isMain:false on all profiles that don't have the field
  await (profiles as any).updateMany(
    { isMain: { $exists: false } },
    { $set: { isMain: false } },
  );

  // Set isMain:true on Monthly Budget profiles
  const result = await (profiles as any).updateMany(
    { name: 'Monthly Budget', profileType: 'monthly', isMain: false },
    { $set: { isMain: true } },
  );

  console.log(`✓ Set isMain=true on ${result.modifiedCount} Monthly Budget profile(s)`);
}

export async function down(db: MigrationDatabase): Promise<void> {
  const profiles = db.collection('budget_profiles');
  await (profiles as any).updateMany({} as any, { $unset: { isMain: '' } } as any);
  console.log('✓ Removed isMain from budget_profiles');
}
