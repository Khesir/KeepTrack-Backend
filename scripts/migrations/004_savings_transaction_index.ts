/**
 * Migration 004: Add savingsId index to transactions, make accountId optional
 *
 * Why: Savings buckets replaced accounts. Transactions can now be tagged
 *      to a savings bucket via savingsId. accountId is no longer required.
 * Safe to re-run: yes (createIndex is idempotent)
 */

import type { MigrationDatabase } from './types';

export const name = '004_savings_transaction_index';
export const description = 'Index transactions.savingsId; unset required accountId on existing docs';

export async function up(db: MigrationDatabase): Promise<void> {
  const transactions = db.collection('transactions');

  await transactions.createIndex({ savingsId: 1 } as any, { sparse: true });
  console.log('✓ Indexed transactions.savingsId');

  // Null out accountId on documents where it references the dropped accounts collection
  await (transactions as any).updateMany(
    { accountId: { $exists: true, $ne: null } },
    { $set: { accountId: null } },
  );
  console.log('✓ Cleared stale accountId references');
}

export async function down(db: MigrationDatabase): Promise<void> {
  try {
    await (db.collection('transactions') as any).dropIndex('savingsId_1');
  } catch {
    // already gone
  }
}
