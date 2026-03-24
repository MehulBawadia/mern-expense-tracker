const xlsx = require("xlsx");
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

exports.destroy = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Income successfully destroyed.",
      data: [],
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not delete income.",
      data: {
        error: err.message,
      },
    });
  }
};

exports.downloadInExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomeList = await Income.find({ userId }).sort({ date: -1 });

    const data = incomeList.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Income");
    xlsx.writeFile(workbook, `downloads/${userId}_income_details.xlsx`);
    res.download(`downloads/${userId}_income_details.xlsx`);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not download the income in excel.",
      data: {
        error: err.message,
      },
    });
  }
};
