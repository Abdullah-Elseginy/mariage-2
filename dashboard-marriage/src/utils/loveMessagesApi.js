import { formatDashboardApiError } from './apiErrors';
import { getBackendUrl } from './apiConfig';

async function request(path, options = {}) {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(formatDashboardApiError(error, `Request failed with status ${response.status}`));
  }

  if (response.status === 204) return null;
  return response.json();
}

export const loveMessagesApi = {
  list: (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page });
    if (filters.search) params.set('search', filters.search);
    if (filters.template) params.set('template', filters.template);
    if (filters.is_demo !== undefined && filters.is_demo !== '') params.set('is_demo', filters.is_demo);
    if (filters.date) params.set('date', filters.date);
    if (filters.sort) params.set('sort', filters.sort);
    return request(`/admin/love-messages?${params.toString()}`);
  },
  show: (id) => request(`/admin/love-messages/${id}`),
  create: (payload) => request('/admin/love-messages', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/admin/love-messages/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => request(`/admin/love-messages/${id}`, { method: 'DELETE' }),
};
