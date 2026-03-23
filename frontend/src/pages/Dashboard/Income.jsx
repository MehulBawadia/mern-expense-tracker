import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Overview from "../../components/Income/Overview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import CreateForm from "../../components/Income/CreateForm";
import toast from "react-hot-toast";

const Income = () => {
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

  // const deleteIncome = async (income) => {};

  // const handleDownloadIncomeDetails = async () => {};

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
        </div>

        <Modal
          title="Add Income"
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
        >
          <CreateForm onAddIncome={(income) => handleAddIncome(income)} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
