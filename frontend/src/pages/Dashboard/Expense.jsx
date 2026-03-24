import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Overview from "../../components/Expense/Overview";
import Modal from "../../components/Modal";
import CreateForm from "../../components/Expense/CreateForm";

const Expense = () => {
  useUserAuth();

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [expenseData, setExpenseData] = useState([]);

  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.INDEX);
      if (response?.data?.status === "success") {
        setExpenseData(response?.data?.data);
      }
    } catch (error) {
      console.log("Could not fetch expense details.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, date, amount, icon } = expense;

    if (category.length <= 0) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) < 0) {
      toast.error("Amount must be a number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      const response = await axiosInstance.post(`${API_PATHS.EXPENSE.STORE}`, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success(response.data.message);

      await fetchExpenseDetails();
    } catch (error) {
      console.log(
        "Error adding message",
        error.response?.data?.message || error.message,
      );
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <Overview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>
        </div>

        <Modal
          title="Add Expense"
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
        >
          <CreateForm onAddExpense={(expense) => handleAddExpense(expense)} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
