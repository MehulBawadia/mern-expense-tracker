import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const CreateForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: 0.0,
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        type="text"
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        label="Income Source"
        placeholder="Freelance, Salary, etc"
      />

      <Input
        type="number"
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
      />

      <Input
        type="date"
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddIncome(income)}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
