import type { MigrationDatabase } from './types';

export const name = '010_budget_profile_type';
export const description = 'Add profileType field to budget_profiles (default: custom)';

export async function up(db: MigrationDatabase): Promise<void> {
  const col = db.collection('budget_profiles');
  await col.updateMany(
    { profileType: { $exists: false } } as any,
    { $set: { profileType: 'custom' } } as any,
  );
  console.log('✓ Backfilled profileType on budget_profiles');
}

export async function down(db: MigrationDatabase): Promise<void> {
  const col = db.collection('budget_profiles');
  await col.updateMany({} as any, { $unset: { profileType: '' } } as any);
  console.log('✓ Removed profileType from budget_profiles');
}
