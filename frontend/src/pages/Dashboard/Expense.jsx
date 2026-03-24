import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Overview from "../../components/Expense/Overview";
import Modal from "../../components/Modal";
import CreateForm from "../../components/Expense/CreateForm";
import Listing from "../../components/Expense/Listing";
import DeleteAlert from "../../components/DeleteAlert";

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

  const deleteExpense = async (expenseId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_PATHS.EXPENSE.DESTROY(expenseId)}`,
      );

      setOpenDeleteAlert({ show: false, data: null });
      toast.success(response.data?.message);
      await fetchExpenseDetails();
    } catch (error) {
      console.log(
        "Could not delete expense.",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.DOWNLOAD_IN_EXCEL}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Could not download expense details.", error);
      toast.error("Failed to download expense details.");
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

          <Listing
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownload}
          />
        </div>

        <Modal
          title="Add Expense"
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
        >
          <CreateForm onAddExpense={(expense) => handleAddExpense(expense)} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail? This action cannot be undone."
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
