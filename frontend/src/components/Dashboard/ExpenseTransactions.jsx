import { LuArrowRight } from "react-icons/lu";
import { DateTime } from "luxon";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((epense) => (
          <TransactionInfoCard
            key={epense._id}
            title={epense.category}
            icon={epense.icon}
            amount={epense.amount}
            type={epense.type}
            date={DateTime.fromISO(epense.date).toLocaleString(
              DateTime.DATE_FULL,
            )}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
