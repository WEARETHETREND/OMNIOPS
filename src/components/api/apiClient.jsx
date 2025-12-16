// API client for custom OmniOps Node.js backend
import axios from "axios";

const API_BASE =
  (typeof window !== "undefined" && window.__OMNIOPS_API_BASE__) ||
  "http://127.0.0.1:4000"; // change to your deployed API later

function getToken() {
  return localStorage.getItem("omniops_token") || "";
}

function getTenantKey() {
  return localStorage.getItem("omniops_tenant_key") || "demo_tenant_key";
}

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const tenantKey = getTenantKey();

  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (tenantKey) config.headers["x-tenant-key"] = tenantKey;

  return config;
});

export async function safeGet(path, params) {
  try {
    const res = await api.get(path, { params });
    return { ok: true, data: res.data };
  } catch (e) {
    const status = e?.response?.status || 0;
    const msg = e?.response?.data?.error || e?.message || "Request failed";
    return { ok: false, status, error: msg };
  }
}

export async function safePost(path, body) {
  try {
    const res = await api.post(path, body ?? {});
    return { ok: true, data: res.data };
  } catch (e) {
    const status = e?.response?.status || 0;
    const msg = e?.response?.data?.error || e?.message || "Request failed";
    return { ok: false, status, error: msg };
  }
}