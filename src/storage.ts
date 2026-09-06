import * as fs from "fs";
import * as path from "path";
import { Expense, Result, ok, err } from "./types";

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "expenses.json");

export type StorageError =
  | { kind: "read_failed"; message: string }
  | { kind: "parse_failed"; message: string }
  | { kind: "write_failed"; message: string };

export function loadExpenses(): Result<Expense[], StorageError> {
  if (!fs.existsSync(DATA_FILE)) {
    return ok([]);
  }

  let raw: string;
  try {
    raw = fs.readFileSync(DATA_FILE, "utf-8");
  } catch (e) {
    return err({ kind: "read_failed", message: (e as Error).message });
  }

  if (raw.trim() === "") {
    return ok([]);
  }

  try {
    const parsed = JSON.parse(raw) as Expense[];
    return ok(parsed);
  } catch (e) {
    return err({ kind: "parse_failed", message: (e as Error).message });
  }
}

export function saveExpenses(expenses: Expense[]): Result<void, StorageError> {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
    return ok(undefined);
  } catch (e) {
    return err({ kind: "write_failed", message: (e as Error).message });
  }
}
