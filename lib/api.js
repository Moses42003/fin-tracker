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
  verifyLoginOtp: "/api/goal/users/verify-login-otp",
  requestPasswordReset: "/api/goal/users/forgot_password/",
  resetPassword: "/api/goal/users/reset_password",
};

if (!API_BASE) {
  console.log("EXPO_PUBLIC_API_BASE is not set");
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
