const mongoose = require("mongoose");

const IncomeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: { type: String, required: true }, // Example: Salary, Freelance, etc
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now() },
    icon: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Income", IncomeSchema);
