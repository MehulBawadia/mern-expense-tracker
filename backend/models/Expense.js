const mongoose = require("mongoose");

const ExpenseSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true }, // Example: Foos, Rent, Groceries, etc
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now() },
    icon: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", ExpenseSchema);
