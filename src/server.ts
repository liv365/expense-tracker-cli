import express from "express";
import * as path from "path";
import { addExpense } from "./commands/add";
import { listExpenses } from "./commands/list";
import { deleteExpense } from "./commands/delete";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/expenses", (_req, res) => {
  const result = listExpenses();
  if (result.ok) {
    res.json(result.value);
  } else {
    res.status(500).json({ error: result.error.message });
  }
});

app.post("/api/expenses", (req, res) => {
  const { description, amount } = req.body;
  const result = addExpense(description, parseFloat(amount));
  if (result.ok) {
    res.status(201).json({ id: result.value });
  } else {
    res.status(400).json({ error: result.error.message });
  }
});

app.delete("/api/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const result = deleteExpense(id);
  if (result.ok) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: result.error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Expense tracker UI running at http://localhost:${PORT}`);
});
