import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Overview from "../../components/Income/Overview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import CreateForm from "../../components/Income/CreateForm";
import toast from "react-hot-toast";
import Listing from "../../components/Income/Listing";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
  useUserAuth();

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [incomeData, setIncomeData] = useState([]);

  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.INDEX);
      if (response?.data?.status === "success") {
        setIncomeData(response?.data?.data);
      }
    } catch (error) {
      console.log("Could not fetch income details.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, date, amount, icon } = income;

    if (source.length <= 0) {
      toast.error("Source is required.");
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
      const response = await axiosInstance.post(`${API_PATHS.INCOME.STORE}`, {
        source,
        amount,
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success(response.data.message);

      await fetchIncomeDetails();
    } catch (error) {
      console.log(
        "Error adding message",
        error.response?.data?.message || error.message,
      );
    }
  };

  const deleteIncome = async (incomeId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_PATHS.INCOME.DESTROY(incomeId)}`,
      );

      setOpenDeleteAlert({ show: false, data: null });
      toast.success(response.data?.message);
      await fetchIncomeDetails();
    } catch (error) {
      console.log(
        "Could not delete income.",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.DOWNLOAD_IN_EXCEL}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Could not download income details.", error);
      toast.error("Failed to download income details.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <Overview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <Listing
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownload}
          />
        </div>

        <Modal
          title="Add Income"
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
        >
          <CreateForm onAddIncome={(income) => handleAddIncome(income)} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income detail? This action cannot be undone."
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
