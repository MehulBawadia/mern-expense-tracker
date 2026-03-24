import React from "react";
import { LuDownload } from "react-icons/lu";
import { DateTime } from "luxon";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const Listing = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Categories</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            type="expense"
            title={expense.category}
            amount={expense.amount}
            icon={expense.icon}
            date={DateTime.fromISO(expense.date).toLocaleString(
              DateTime.DATE_FULL,
            )}
            onDelete={() => onDelete(expense._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Listing;
