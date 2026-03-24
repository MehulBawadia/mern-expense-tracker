import React from "react";
import { LuDownload } from "react-icons/lu";
import { DateTime } from "luxon";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const Listing = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            type="income"
            title={income.source}
            amount={income.amount}
            icon={income.icon}
            date={DateTime.fromISO(income.date).toLocaleString(
              DateTime.DATE_FULL,
            )}
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Listing;
