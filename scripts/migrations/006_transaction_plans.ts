/**
 * Migration 006: Transaction plans collection
 *
 * Why: New transaction planning feature — users plan future income/expenses
 *      before they happen, then complete them to create real transactions.
 * Safe to re-run: yes
 */

import type { MigrationDatabase } from './types';

export const name = '006_transaction_plans';
export const description = 'Index transactionplans collection';

export async function up(db: MigrationDatabase): Promise<void> {
  const plans = db.collection('transactionplans');
  await plans.createIndex({ userId: 1 } as any);
  await plans.createIndex({ userId: 1, plannedDate: 1 } as any);
  await plans.createIndex({ userId: 1, status: 1 } as any);
  console.log('✓ Indexed transactionplans');
}

export async function down(db: MigrationDatabase): Promise<void> {
  try { await (db.collection('transactionplans') as any).drop(); } catch { /* ok */ }
}
