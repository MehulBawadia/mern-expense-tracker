const Expense = require("../models/Expense");

exports.store = async (req, res) => {
  const userId = req.user.id;

  try {
    const { category, amount, date, icon } = req.body;

    if (!category || !amount || !date) {
      return res.status(422).json({
        status: "failed",
        message: "Fill in the details.",
        data: [],
      });
    }

    const newExpense = new Expense({
      userId,
      category,
      amount,
      date: new Date(date),
      icon,
    });
    await newExpense.save();

    res.status(201).json({
      status: "success",
      message: "Expense successfully added.",
      data: {
        id: newExpense._id,
        expense: newExpense,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not add expense.",
      data: {
        error: err.message,
      },
    });
  }
};
