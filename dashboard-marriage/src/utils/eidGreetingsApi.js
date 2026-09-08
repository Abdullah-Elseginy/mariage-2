import { formatDashboardApiError } from './apiErrors';
import { getBackendUrl } from './apiConfig';

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

  if (response.status === 204) return null;

  return response.json();
}

let greetingsCache = {};

export const eidGreetingsApi = {
  clearCache() {
    greetingsCache = {};
  },

  async list(page = 1, filters = {}) {
    const params = new URLSearchParams({ page });
    if (filters.search) params.append('search', filters.search);
    if (filters.is_demo !== undefined && filters.is_demo !== '') {
      params.append('is_demo', filters.is_demo);
    }
    if (filters.date) params.append('date', filters.date);
    if (filters.sort) params.append('sort', filters.sort);

    const queryString = params.toString();
    const cacheKey = `list-${queryString}`;
    if (greetingsCache[cacheKey]) {
      return greetingsCache[cacheKey];
    }
    const res = await request(`/admin/eid-greetings?${queryString}`);
    greetingsCache[cacheKey] = res;
    return res;
  },

  async create(payload) {
    this.clearCache();
    return request('/admin/eid-greetings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async show(id) {
    return request(`/admin/eid-greetings/${id}`);
  },

  async update(id, payload) {
    this.clearCache();
    return request(`/admin/eid-greetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id) {
    this.clearCache();
    return request(`/admin/eid-greetings/${id}`, {
      method: 'DELETE',
    });
  },
};
