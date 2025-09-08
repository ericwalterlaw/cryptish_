// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchData(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Default headers
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }), // attach token if exists
  };

  // ✅ Only set Content-Type if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Auto logout on invalid token
      localStorage.removeItem("bankToken");
    }
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  // If response has no JSON (like 204 No Content), return null
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ✅ Wrapper methods
export const api = {
  get: (endpoint) => fetchData(endpoint),

  post: (endpoint, body) =>
    fetchData(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    fetchData(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    fetchData(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint) => fetchData(endpoint, { method: "DELETE" }),
};
