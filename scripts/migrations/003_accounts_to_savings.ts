/**
 * Migration 003: Replace accounts collection with savings
 *
 * Why: The accounts feature was removed and replaced with a simpler
 *      named savings buckets concept. This indexes the new savings
 *      collection and drops the old accounts collection.
 * Safe to re-run: yes (createIndex is idempotent, dropCollection is a no-op if gone)
 */

import type { MigrationDatabase } from './types';

export const name = '003_accounts_to_savings';
export const description = 'Index savings collection, drop legacy accounts collection';

export async function up(db: MigrationDatabase): Promise<void> {
  const savings = db.collection('savings');
  await savings.createIndex({ userId: 1 } as any);
  console.log('✓ Indexed savings');

  try {
    await (db.collection('accounts') as any).drop();
    console.log('✓ Dropped legacy accounts collection');
  } catch {
    console.log('✓ accounts collection already gone — skipping drop');
  }
}

export async function down(db: MigrationDatabase): Promise<void> {
  try {
    await (db.collection('savings') as any).drop();
    console.log('✓ Dropped savings collection');
  } catch {
    // already gone
  }
}
