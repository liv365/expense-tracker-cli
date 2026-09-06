import { loadExpenses, saveExpenses, StorageError } from "../storage";
import { Result, ok, err } from "../types";

export type DeleteError =
  | { kind: "not_found"; message: string }
  | { kind: "storage_error"; message: string };

export function deleteExpense(id: number): Result<void, DeleteError> {
  const loaded = loadExpenses();
  if (!loaded.ok) {
    return err({ kind: "storage_error", message: loaded.error.message });
  }

  const expenses = loaded.value;
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    return err({ kind: "not_found", message: `No expense found with id ${id}` });
  }

  expenses.splice(index, 1);

  const saved = saveExpenses(expenses);
  if (!saved.ok) {
    return err({ kind: "storage_error", message: saved.error.message });
  }

  return ok(undefined);
}
