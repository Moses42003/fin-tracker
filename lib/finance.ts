import { API_ENDPOINTS, apiFetch, buildQuery } from "@/lib/api";
import { getSessionToken, getSessionUser } from "@/lib/session";

/**
 * Resolves the signed-in user's id + access token, or throws a friendly error.
 * Every Goal Flow resource endpoint is scoped to the user id, so this is the
 * gate for all calls below.
 */
async function requireSession() {
  const [user, token] = await Promise.all([
    getSessionUser(),
    getSessionToken(),
  ]);
  if (!user?.id || !token) {
    throw new Error("Your session has expired. Please log in again.");
  }
  return { userId: user.id, token };
}

/** ISO date-time string accepted by the backend's `date`/`target_date` fields. */
function toIsoDate(value?: string | Date) {
  if (!value) return new Date().toISOString();
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

export interface TransactionInput {
  amount: string | number;
  category?: string;
  description?: string;
  date?: string | Date;
  paymentMethod?: string;
  isRecurring?: boolean;
  targetId?: string;
}

export interface TargetInput {
  name: string;
  targetAmount: string | number;
  description?: string;
  category?: string;
  targetDate?: string | Date;
  icon?: string;
  color?: string;
}

export interface UserUpdateInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Adds an income record. The backend takes these as query parameters on
 * POST /api/goal/users/{user_id}/transactions/income (no JSON body).
 * @param {TransactionInput} input
 */
export async function addIncome(input: TransactionInput) {
  const { userId, token } = await requireSession();
  return apiFetch(
    `${API_ENDPOINTS.income(userId)}${buildQuery({
      amount: input.amount,
      category: input.category,
      description: input.description,
      date: toIsoDate(input.date),
      payment_method: input.paymentMethod,
    })}`,
    { method: "POST", token },
  );
}

/**
 * Adds an expense record. Same query-parameter shape as income, on
 * POST /api/goal/users/{user_id}/transactions/expenses.
 * @param {TransactionInput} input
 */
export async function addExpense(input: TransactionInput) {
  const { userId, token } = await requireSession();
  return apiFetch(
    `${API_ENDPOINTS.expenses(userId)}${buildQuery({
      amount: input.amount,
      category: input.category,
      description: input.description,
      date: toIsoDate(input.date),
      payment_method: input.paymentMethod,
    })}`,
    { method: "POST", token },
  );
}

/** Lists income records for the signed-in user. */
export async function listIncome(): Promise<TransactionRecord[]> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(API_ENDPOINTS.income(userId), { token });
  return Array.isArray(data) ? (data as TransactionRecord[]) : [];
}

/** Lists expense records for the signed-in user. */
export async function listExpenses(): Promise<TransactionRecord[]> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(API_ENDPOINTS.expenses(userId), { token });
  return Array.isArray(data) ? (data as TransactionRecord[]) : [];
}

/**
 * Creates a savings target. POST /api/goal/users/{user_id}/targets takes a JSON
 * body matching TargetCreate (name + target_amount required).
 * @param {TargetInput} input
 */
export async function createTarget(input: TargetInput) {
  const { userId, token } = await requireSession();
  return apiFetch(API_ENDPOINTS.targets(userId), {
    method: "POST",
    token,
    body: {
      name: input.name,
      target_amount: String(input.targetAmount),
      description: input.description ?? null,
      category: input.category ?? null,
      target_date: input.targetDate ? toIsoDate(input.targetDate) : null,
      icon: input.icon ?? null,
      color: input.color ?? null,
    },
  });
}

/**
 * Updates the signed-in user's account.
 *
 * PUT /api/goal/users/{id} requires `email`. Note two live-backend quirks
 * verified against the server: the schema rejects a `password` field (it must
 * be omitted, and password changes go through the OTP reset flow instead), and
 * server-side `phone` changes are silently ignored.
 * @param {UserUpdateInput} input
 */
export async function updateUserAccount(input: UserUpdateInput) {
  const { userId, token } = await requireSession();

  const body: Record<string, unknown> = { email: input.email.trim() };
  if (input.firstName !== undefined) body.first_name = input.firstName.trim();
  if (input.lastName !== undefined) body.last_name = input.lastName.trim();
  if (input.phone !== undefined) body.phone = input.phone.trim();

  return apiFetch(API_ENDPOINTS.user(userId), {
    method: "PUT",
    token,
    body,
  });
}

/**
 * Requests a password-reset OTP for the signed-in user. This is the supported
 * way to change a password, since PUT /users/{id} rejects the `password` field.
 */
export async function requestPasswordResetForAccount(target: string) {
  return apiFetch("/api/goal/users/forgot_password/", {
    method: "POST",
    body: { target },
  });
}
/** A transaction row as returned by the API (amounts are strings, "25.50"). */
export interface TransactionRecord {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: string;
  description?: string | null;
  category?: string | null;
  date: string;
  payment_method?: string | null;
  is_recurring?: boolean;
  target_id?: string | null;
  created_date?: string;
  updated_date?: string;
}

/** A target row as returned by the API. */
export interface TargetResponse {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  target_amount: string;
  current_amount: string;
  category?: string | null;
  target_date?: string | null;
  icon?: string | null;
  color?: string | null;
  status: string;
  progress_percentage: number;
  created_date?: string;
  updated_date?: string;
}

/** GET /users/{id}/dashboard/overview — the account-wide totals. */
export interface DashboardOverview {
  balance: string;
  income: string;
  expenses: string;
  savings: string;
  budget_utilization: string;
  active_targets: number;
  total_target_amount: string;
  total_saved: string;
  target_progress: number;
}

/** GET /users/{id}/dashboard/summary — totals plus category/trend breakdowns. */
export interface DashboardSummary {
  total_balance: string;
  total_income: string;
  total_expenses: string;
  total_savings: string;
  income_by_category: Record<string, string>;
  expenses_by_category: Record<string, string>;
  spending_trend: { date: string; amount: number }[];
  recent_transactions: TransactionRecord[];
  targets_summary: {
    total_targets?: number;
    total_target_amount?: string;
    total_saved_amount?: string;
  };
}

/** Fetches the account-wide totals used by the home header cards. */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(API_ENDPOINTS.dashboardOverview(userId), {
    token,
  });
  return data as unknown as DashboardOverview;
}

/**
 * Fetches the full dashboard summary: totals, per-category totals, the spending
 * trend and the most recent transactions in one request.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(API_ENDPOINTS.dashboardSummary(userId), {
    token,
  });
  return {
    total_balance: "0.00",
    total_income: "0.00",
    total_expenses: "0.00",
    total_savings: "0.00",
    income_by_category: {},
    expenses_by_category: {},
    spending_trend: [],
    recent_transactions: [],
    targets_summary: {},
    ...data,
  } as DashboardSummary;
}

/** Lists every transaction (income + expenses) for the signed-in user. */
export async function listTransactions(): Promise<TransactionRecord[]> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(API_ENDPOINTS.transactions(userId), { token });
  return Array.isArray(data) ? (data as TransactionRecord[]) : [];
}

/** Lists the signed-in user's targets. */
export async function listTargets(): Promise<TargetResponse[]> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(API_ENDPOINTS.targets(userId), { token });
  return Array.isArray(data) ? (data as TargetResponse[]) : [];
}

/** Fetches a single target by id. */
export async function getTarget(targetId: string): Promise<TargetResponse> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(API_ENDPOINTS.target(userId, targetId), {
    token,
  });
  return data as unknown as TargetResponse;
}

/**
 * Adds funds to a target. Note the backend takes `amount` as a query parameter
 * on this endpoint (verified against the live server), not a JSON body.
 */
export async function addFundsToTarget(targetId: string, amount: string) {
  const { userId, token } = await requireSession();
  return apiFetch(
    `${API_ENDPOINTS.targetAddFunds(userId, targetId)}${buildQuery({ amount })}`,
    { method: "POST", token },
  );
}
/** Budget settings stored per user: GET/PUT .../settings/budget. */
export interface BudgetSettings {
  id?: string;
  user_id?: string;
  monthly_budget?: string | null;
  category_budgets?: string | null;
  currency?: string | null;
  notification_threshold?: string;
}

/** Budget utilization: how much of the monthly budget is used. */
export interface BudgetUtilization {
  monthly_budget?: string | null;
  spent?: string;
  utilization_percentage?: number;
  remaining?: string;
  currency?: string | null;
}

/** Reads the signed-in user's budget settings. */
export async function getBudgetSettings(): Promise<BudgetSettings> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(`/api/goal/users/${userId}/settings/budget`, {
    token,
  });
  return data as unknown as BudgetSettings;
}

/**
 * Saves budget settings. The backend accepts a partial update, so only the
 * fields the caller passes are sent.
 */
export async function updateBudgetSettings(input: {
  monthlyBudget?: string;
  currency?: string;
  notificationThreshold?: string;
  categoryBudgets?: string;
}): Promise<BudgetSettings> {
  const { userId, token } = await requireSession();

  const body: Record<string, unknown> = {};
  if (input.monthlyBudget !== undefined)
    body.monthly_budget = input.monthlyBudget;
  if (input.currency !== undefined) body.currency = input.currency;
  if (input.notificationThreshold !== undefined)
    body.notification_threshold = input.notificationThreshold;
  if (input.categoryBudgets !== undefined)
    body.category_budgets = input.categoryBudgets;

  const data = await apiFetch(`/api/goal/users/${userId}/settings/budget`, {
    method: "PUT",
    token,
    body,
  });
  return data as unknown as BudgetSettings;
}

/** Reads how much of the monthly budget has been used. */
export async function getBudgetUtilization(): Promise<BudgetUtilization> {
  const { userId, token } = await requireSession();
  const data = await apiFetch(
    `/api/goal/users/${userId}/settings/budget/utilization`,
    { token },
  );
  return data as unknown as BudgetUtilization;
}
