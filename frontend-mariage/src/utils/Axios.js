import axios from 'axios';
import i18n from '../i18n';
import { getBackendUrl } from './apiConfig';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://adequate-blessing-production-4ffe.up.railway.app/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});


const Axios = ({ method, path, data, params, header, pathParams = '', isFormData = false, ...extraConfig }) => {
  const currentLanguage = localStorage.getItem('i18nextLng') || i18n.resolvedLanguage || i18n.language || 'en';
  const normalizedLanguage = currentLanguage.split('-')[0];

  return axiosInstance({
    baseURL: getBackendUrl(),
    method,
    url: `${path}${pathParams}`,
    data,
    params,
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      Accept: 'application/json',
      'Accept-Language': normalizedLanguage,
      'X-Requested-With': 'XMLHttpRequest',
      ...header,
    },
    ...extraConfig,
  });
};

export default Axios;
