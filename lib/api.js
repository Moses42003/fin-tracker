const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

function encodeFormBody(body) {
  return Object.entries(body)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
}

export const AUTH_ENDPOINTS = {
  signup: "/api/goal/users/",
  login: "/auth/token",
  verifyOtp: "/api/goal/users/verify-otp",
  resendOtp: "/api/goal/users/resend-otp",
  verifyLoginOtp: "/api/goal/users/verify-login-otp",
  requestPasswordReset: "/api/goal/users/forgot_password/",
  resetPassword: "/api/goal/users/reset_password",
};

/**
 * Endpoint builders for the authenticated Goal Flow resources.
 * Every resource is scoped to the signed-in user's id.
 */
export const API_ENDPOINTS = {
  user: (userId) => `/api/goal/users/${userId}`,
  targets: (userId) => `/api/goal/users/${userId}/targets`,
  target: (userId, targetId) =>
    `/api/goal/users/${userId}/targets/${targetId}`,
  targetAddFunds: (userId, targetId) =>
    `/api/goal/users/${userId}/targets/${targetId}/add-funds`,
  transactions: (userId) => `/api/goal/users/${userId}/transactions`,
  income: (userId) => `/api/goal/users/${userId}/transactions/income`,
  expenses: (userId) => `/api/goal/users/${userId}/transactions/expenses`,
  dashboardSummary: (userId) =>
    `/api/goal/users/${userId}/dashboard/summary`,
  dashboardOverview: (userId) =>
    `/api/goal/users/${userId}/dashboard/overview`,
  uploadProfilePicture: (userId) =>
    `/api/goal/users/${userId}/upload/profile-picture`,
  profilePicture: (userId) =>
    `/api/goal/users/${userId}/profile-picture`,
  deleteProfilePicture: (userId) =>
    `/api/goal/users/${userId}/profile-picture`,
};

/**
 * Builds a query string, dropping null/undefined/empty values so optional
 * fields are never sent as the literal string "undefined".
 * @param {Record<string, unknown>} params
 */
export function buildQuery(params) {
  const search = Object.entries(params)
    .filter(
      ([, value]) =>
        value !== undefined && value !== null && String(value).trim() !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
  return search ? `?${search}` : "";
}

if (!API_BASE) {
  console.log("EXPO_PUBLIC_API_BASE is not set");
}

/**
 * Uploads a local file as multipart/form-data.
 *
 * `apiFetch` cannot do this: a multipart body must NOT set Content-Type by
 * hand, because the runtime has to generate the boundary itself.
 *
 * @param {string} path
 * @param {{ uri: string, name?: string, type?: string }} file
 * @param {{ field?: string, token?: string, timeoutMs?: number }} options
 * @returns {Promise<Record<string, any>>}
 */
export async function apiUpload(
  path,
  file,
  { field = "file", token, timeoutMs = 120000 } = {},
) {
  if (!API_BASE) {
    throw new Error("API URL is not configured. Set EXPO_PUBLIC_API_BASE.");
  }

  const formData = new FormData();
  // React Native accepts this {uri, name, type} shape directly.
  formData.append(field, {
    uri: file.uri,
    name: file.name || "profile-picture.jpg",
    type: file.type || "image/jpeg",
  });

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The upload took too long. Please try again.");
    }
    throw new Error("Unable to reach the server. Check your connection.");
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail
          .map((item) => item.msg || item.message || String(item))
          .join("; ")
      : data.detail;
    throw new Error(
      data.message ||
        data.error ||
        detail ||
        `Upload failed (${response.status})`,
    );
  }

  return data;
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: Record<string, unknown>, token?: string, form?: boolean, timeoutMs?: number, timeoutMessage?: string }} options
 * @returns {Promise<Record<string, any>>}
 */
export async function apiFetch(
  path,
  {
    method = "GET",
    body,
    token,
    form = false,
    timeoutMs = 90000,
    timeoutMessage = "The server took too long to respond. Please try again.",
  } = {},
) {
  if (!API_BASE) {
    throw new Error("API URL is not configured. Set EXPO_PUBLIC_API_BASE.");
  }

  const headers = form
    ? { "Content-Type": "application/x-www-form-urlencoded" }
    : { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body
        ? form
          ? encodeFormBody(body)
          : JSON.stringify(body)
        : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(timeoutMessage);
    }
    throw new Error("Unable to reach the server. Check your connection.");
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail
          .map((item) => item.msg || item.message || String(item))
          .join("; ")
      : data.detail;
    const message =
      data.message ||
      data.error ||
      detail ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}
