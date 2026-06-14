import { setTokens, clearTokens } from "./api";

const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? ""
    : "https://cheeseball-v2.vercel.app";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { __raw: text };
  }
}

function getErrorMessage(data, defaultMessage) {
  if (!data) return defaultMessage;
  if (data?.detail?.[0]?.msg) return data.detail[0].msg;
  if (data?.detail) return data.detail;
  if (data?.message) return data.message;

  if (data?.__raw) {
    const raw = String(data.__raw);
    console.error("Server raw response:", raw);

    const looksLikeServerError =
      raw.includes("Traceback") ||
      (raw.toLowerCase().includes("error") && raw.length > 200) ||
      /<\/?html>/i.test(raw);

    if (looksLikeServerError) return "Server error. Please try again later.";
    return raw.length > 200 ? `${raw.slice(0, 200)}...` : raw;
  }

  return defaultMessage;
}

async function request(path, body, fallbackMessage) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallbackMessage));
  }
  return data;
}

const authService = {
  register: ({ email, password, confirm_password, referral_code = "" }) =>
    request(
      "/api/auth/register",
      { email, password, confirm_password, referral_code },
      "Registration failed",
    ),

  login: async ({ email, password }) => {
    const data = await request(
      "/api/auth/token/pair",
      { email, password },
      "Login failed",
    );
    // Store tokens in localStorage for Authorization header usage
    if (data?.access) {
      setTokens(data.access);
    }
    return data;
  },

  resendOTP: (email) =>
    request(
      "/api/auth/resend-token",
      { email },
      "Failed to resend token",
    ),

  verifyOTP: async (email, token) => {
    const data = await request(
      "/api/auth/verify-token",
      { email, token },
      "Verification failed",
    );
    // Store tokens in localStorage after verification (auto-login)
    if (data?.access) {
      setTokens(data.access);
    }
    return data;
  },

  verifyResetToken: (email, token) =>
    request(
      "/api/auth/verify-reset-token",
      { email, token },
      "Verification failed",
    ),

  forgotPassword: (email) =>
    request(
      "/api/auth/forgot-password",
      { email },
      "Failed to request password reset",
    ),

  resetPassword: ({ email, token, password, confirm_password }) =>
    request(
      "/api/auth/reset-password",
      { email, token, password, confirm_password },
      "Failed to reset password",
    ),

  logout: async () => {
    try {
      await request("/api/auth/logout", {}, "Logout failed");
    } finally {
      clearTokens();
      window.location.href = "/login";
    }
  },
};

export default authService;
