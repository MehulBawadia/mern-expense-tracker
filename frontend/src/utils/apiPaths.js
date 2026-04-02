export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    USER_INFO: "/api/v1/auth/user-info",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    INDEX: "/api/v1/income",
    STORE: "/api/v1/income/create",
    DESTROY: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_IN_EXCEL: "/api/v1/income/download-in-excel",
  },
  EXPENSE: {
    INDEX: "/api/v1/expense",
    STORE: "/api/v1/expense/create",
    DESTROY: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_IN_EXCEL: "/api/v1/expense/download-in-excel",
  },
  IMAGE: {
    UPPLOAD: "/api/v1/upload-image",
  },
};
