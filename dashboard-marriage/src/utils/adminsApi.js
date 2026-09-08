import { getBackendUrl } from './apiConfig';
import { formatDashboardApiError } from './apiErrors';

async function request(path, options = {}) {
  const currentBase = getBackendUrl();
  const url = `${currentBase}${path}`;
  
  const response = await fetch(url, {
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

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const adminsApi = {
  async list() {
    return request('/admin/admins');
  },
  async create(payload) {
    return request('/admin/admins', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async remove(id) {
    return request(`/admin/admins/${id}`, {
      method: 'DELETE',
    });
  },
};
