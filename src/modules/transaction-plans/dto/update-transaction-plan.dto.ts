export class UpdateTransactionPlanDto {
  description?: string;
  amount?: number;
  type?: string;
  plannedDate?: string;
  financeCategoryId?: string;
  budgetId?: string;
  notes?: string;
}
