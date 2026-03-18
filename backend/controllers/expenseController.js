const xlsx = require("xlsx");
const Expense = require("../models/Expense");

exports.index = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenseList = await Expense.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      status: "success",
      message: "Expenses successfully fetched.",
      data: expenseList,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not fetch expense list.",
      data: {
        error: err.message,
      },
    });
  }
};

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

exports.destroy = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Expense successfully destroyed.",
      data: [],
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not delete expense.",
      data: {
        error: err.message,
      },
    });
  }
};

exports.downloadInExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenseList = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenseList.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Expense");
    xlsx.writeFile(workbook, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not download the expense in excel.",
      data: {
        error: err.message,
      },
    });
  }
};
