/**
 * Generic Result type for explicit, exception-free error handling.
 * A function returns Result<T, E> instead of throwing — callers must
 * check `ok` before they can access `value`, so failures can't be
 * silently ignored the way a swallowed try/catch can.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}
