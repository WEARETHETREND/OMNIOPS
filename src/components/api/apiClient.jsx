// API client for OmniOps Node.js backend
import axios from "axios";

const API_BASE =
  (typeof window !== "undefined" && window.__OPSVANTA_API_BASE__) ||
  "http://localhost:4000";

function getToken() {
  return localStorage.getItem("opsvanta_token") || "";
}

function getTenantId() {
  return localStorage.getItem("opsvanta_tenant_id") || "";
}

export const api = axios.create({
  baseURL: `${API_BASE}/v1`,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const tenantId = getTenantId();

  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (tenantId) config.headers["x-tenant-id"] = tenantId;

  return config;
});

export async function safeGet(path, params) {
  try {
    const res = await api.get(path, { params });
    return { ok: true, data: res.data };
  } catch (e) {
    console.error(`GET ${path} failed:`, e.message);
    return { ok: false, status: e.response?.status || 0, error: e.message };
  }
}

export async function safePost(path, body) {
  try {
    const res = await api.post(path, body ?? {});
    return { ok: true, data: res.data };
  } catch (e) {
    console.error(`POST ${path} failed:`, e.message);
    return { ok: false, status: e.response?.status || 0, error: e.message };
  }
}