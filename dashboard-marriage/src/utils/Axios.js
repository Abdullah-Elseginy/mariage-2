import axios from "axios";
import { toast } from "react-toastify";
import i18n from "../i18n";
import { getBackendUrl } from "./apiConfig";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://mariage-2-production.up.railway.app/api/v1";

export const APIS = {
  studentDetailsData: "/students/getStudentByNationalId",
  PostStudentImage: "/uploadFile/image",
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const err = error?.response?.data?.message || "Bad Request";

    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("persist:auth");

      if (window.location.hash !== "#/") {
        window.location.hash = "#/";
        window.location.reload();
      }
    }

    toast.error(err);
    return Promise.reject(error);
  },
);

const Axios = async ({
  method,
  path,
  data,
  params,
  header,
  pathParams = "",
  isFormData = false,
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const currentLanguage =
    localStorage.getItem("i18nextLng") ||
    i18n.resolvedLanguage ||
    i18n.language ||
    "ar";
  const normalizedLanguage = currentLanguage.split("-")[0];
  const authHeader = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};

  const currentBase = getBackendUrl();
  const config = {
    baseURL: currentBase,
    method,
    url: path + pathParams,
    data,
    params,
    headers: isFormData
      ? {
          "Content-Type": "multipart/form-data",
          "Accept-Language": normalizedLanguage,
          ...authHeader,
          ...header,
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": normalizedLanguage,
          "X-Requested-With": "XMLHttpRequest",
          ...authHeader,
          ...header,
        },
    withCredentials: false,
  };

  return await axiosInstance(config);
};

export default Axios;
