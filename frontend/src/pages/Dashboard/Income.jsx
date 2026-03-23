import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Overview from "../../components/Income/Overview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";

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

  // const handleAddIncome = async (income) => {};

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
          <div>MOdal</div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
