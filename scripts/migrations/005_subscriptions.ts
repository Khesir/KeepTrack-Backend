/**
 * Migration 005: Add subscriptions collection and subscriptionId index on transactions
 *
 * Why: New subscriptions feature — recurring bills connected to budget.
 * Safe to re-run: yes (createIndex is idempotent)
 */

import type { MigrationDatabase } from './types';

export const name = '005_subscriptions';
export const description = 'Index subscriptions collection and transactions.subscriptionId';

export async function up(db: MigrationDatabase): Promise<void> {
  const subscriptions = db.collection('subscriptions');
  await subscriptions.createIndex({ userId: 1 } as any);
  await subscriptions.createIndex({ nextBillingDate: 1 } as any);
  console.log('✓ Indexed subscriptions');

  const transactions = db.collection('transactions');
  await transactions.createIndex({ subscriptionId: 1 } as any, { sparse: true });
  console.log('✓ Indexed transactions.subscriptionId');
}

export async function down(db: MigrationDatabase): Promise<void> {
  try { await (db.collection('subscriptions') as any).drop(); } catch { /* ok */ }
  try { await (db.collection('transactions') as any).dropIndex('subscriptionId_1'); } catch { /* ok */ }
}
