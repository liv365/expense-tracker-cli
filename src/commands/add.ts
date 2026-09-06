import { loadExpenses, saveExpenses, StorageError } from "../storage";
import { Result, ok, err } from "../types";

export type AddError =
  | { kind: "invalid_description"; message: string }
  | { kind: "invalid_amount"; message: string }
  | { kind: "storage_error"; message: string };

export function addExpense(
  description: string,
  amount: number
): Result<number, AddError> {
  if (!description || description.trim() === "") {
    return err({ kind: "invalid_description", message: "Description cannot be empty" });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return err({ kind: "invalid_amount", message: "Amount must be a positive number" });
  }

  const loaded = loadExpenses();
  if (!loaded.ok) {
    return err({ kind: "storage_error", message: loaded.error.message });
  }

  const expenses = loaded.value;
  const nextId = expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;

  expenses.push({
    id: nextId,
    description: description.trim(),
    amount,
    date: new Date().toISOString(),
  });

  const saved = saveExpenses(expenses);
  if (!saved.ok) {
    return err({ kind: "storage_error", message: saved.error.message });
  }

  return ok(nextId);
}
