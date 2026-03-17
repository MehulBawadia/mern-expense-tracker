const User = require("../models/User");
const Income = require("../models/Income");

exports.index = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomeList = await Income.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      status: "success",
      message: "Income successfully fetched.",
      data: incomeList,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not fetch income list.",
      data: {
        error: err.message,
      },
    });
  }
};

exports.store = async (req, res) => {
  const userId = req.user.id;

  try {
    const { source, amount, date, icon } = req.body;

    if (!source || !amount || !date) {
      return res.status(422).json({
        status: "failed",
        message: "Fill in the details.",
        data: [],
      });
    }

    const newIncome = new Income({
      userId,
      source,
      amount,
      date: new Date(date),
      icon,
    });
    await newIncome.save();

    res.status(201).json({
      status: "success",
      message: "Income successfully added.",
      data: {
        id: newIncome._id,
        income: newIncome,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not add income.",
      data: {
        error: err.message,
      },
    });
  }
};
