/**
 * Bovest API Service
 * Central axios-style fetch wrapper that talks to the FastAPI backend.
 * All components import from here — never write raw fetch() in pages.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem('bovest_token');
export const setToken = (t) => localStorage.setItem('bovest_token', t);
export const removeToken = () => localStorage.removeItem('bovest_token');

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.detail || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

const get  = (path)         => request(path, { method: 'GET' });
const post = (path, body)   => request(path, { method: 'POST',  body: JSON.stringify(body) });
const put  = (path, body)   => request(path, { method: 'PUT',   body: JSON.stringify(body) });

async function uploadAvatar(file) {
  const body = new FormData();
  body.append('avatar', file);
  const token = getToken();
  const res = await fetch(`${BASE_URL}/users/me/avatar`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || 'Avatar upload failed');
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const api = {

  auth: {
    signup: (data) => post('/auth/signup', data),

    login: async (data) => {
      const res = await post('/auth/login', data);
      if (res?.access_token) setToken(res.access_token);
      return res;
    },

    forgotPassword: (data) => post('/auth/forgot-password', data),

    logout: async () => {
      // Tell the server first so the farm dashboard shows this investor offline straight away
      try { await post('/users/me/offline', {}); } catch { /* ignore */ }
      removeToken();
    },
  },

  // ─── User ─────────────────────────────────────────────────────────────────

  user: {
    me:              ()     => get('/users/me'),
    updateProfile:   (data) => put('/users/me', data),
    uploadAvatar,
    heartbeat:       ()     => post('/users/me/heartbeat', {}),
    getBankDetails:  ()     => get('/users/me/bank-details'),
    saveBankDetails: (data) => put('/users/me/bank-details', data),
    getKyc:          ()     => get('/users/me/kyc'),
    submitKyc:       (data) => put('/users/me/kyc', data),
  },

  // ─── Investments ──────────────────────────────────────────────────────────

  investments: {
    list:       ()     => get('/investments'),
    get:        (id)   => get(`/investments/${id}`),
    create:     (data) => post('/investments', data),
    schemes:    ()     => get('/investments/schemes'),
    calculator: (scheme, amount) =>
      get(`/investments/calculator?scheme=${scheme}&amount=${amount}`),
  },

  // ─── Invoices & payout slips ──────────────────────────────────────────────

  invoices: {
    list: () => get('/invoices'),
  },

  // ─── Cows ─────────────────────────────────────────────────────────────────

  cows: {
    list:          ()      => get('/cows'),
    get:           (id)    => get(`/cows/${id}`),
    milkRecords:   (id)    => get(`/cows/${id}/milk-records`),
    addMilkRecord: (id, d) => post(`/cows/${id}/milk-records`, d),
    monthlySummary:(id)    => get(`/cows/${id}/monthly-summary`),
  },

  // ─── Reports ──────────────────────────────────────────────────────────────

  reports: {
    portfolio: () => get('/reports/portfolio'),
    monthly:   () => get('/reports/monthly'),
    daily:     () => get('/reports/daily'),
  },

  // ─── Notifications ────────────────────────────────────────────────────────

  notifications: {
    list:       ()    => get('/notifications'),
    markRead:   (ids) => put('/notifications/mark-read', { notification_ids: ids || [] }),
    farmAlerts: ()    => get('/notifications/farm-alerts'),
  },
};
