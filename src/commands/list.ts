import { loadExpenses, StorageError } from "../storage";
import { Expense, Result } from "../types";

export function listExpenses(): Result<Expense[], StorageError> {
  return loadExpenses();
}
