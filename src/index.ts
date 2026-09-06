#!/usr/bin/env node
import { addExpense } from "./commands/add";
import { listExpenses } from "./commands/list";
import { deleteExpense } from "./commands/delete";

function parseFlags(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      flags[arg.slice(2)] = args[i + 1];
      i++;
    }
  }
  return flags;
}

function printUsage(): void {
  console.log("Usage:");
  console.log("  expense-tracker add --description <text> --amount <number>");
  console.log("  expense-tracker list");
  console.log("  expense-tracker delete --id <number>");
}

function main(): void {
  const [, , command, ...rest] = process.argv;
  const flags = parseFlags(rest);

  switch (command) {
    case "add": {
      const description = flags.description ?? "";
      const amount = parseFloat(flags.amount);
      const result = addExpense(description, amount);
      if (result.ok) {
        console.log(`Expense added successfully (ID: ${result.value})`);
      } else {
        console.error(`Error: ${result.error.message}`);
        process.exitCode = 1;
      }
      break;
    }

    case "list": {
      const result = listExpenses();
      if (result.ok) {
        if (result.value.length === 0) {
          console.log("No expenses recorded.");
        } else {
          console.log("ID   Date        Description          Amount");
          for (const e of result.value) {
            console.log(
              `${String(e.id).padEnd(5)}${e.date.slice(0, 10).padEnd(12)}${e.description.padEnd(
                21
              )}$${e.amount.toFixed(2)}`
            );
          }
        }
      } else {
        console.error(`Error: ${result.error.message}`);
        process.exitCode = 1;
      }
      break;
    }

    case "delete": {
      const id = parseInt(flags.id, 10);
      const result = deleteExpense(id);
      if (result.ok) {
        console.log(`Expense deleted successfully (ID: ${id})`);
      } else {
        console.error(`Error: ${result.error.message}`);
        process.exitCode = 1;
      }
      break;
    }

    default: {
      printUsage();
      process.exitCode = command ? 1 : 0;
      break;
    }
  }
}

main();
