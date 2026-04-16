const API_BASE = "https://cheeseball-v2.vercel.app";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  // fallback: some errors may return plain text (Traceback, HTML, etc.)
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { __raw: text };
  }
}

function getErrorMessage(data, defaultMsg) {
  if (!data) return defaultMsg;
  if (data?.detail?.[0]?.msg) return data.detail[0].msg;
  if (data?.detail) return data.detail;
  if (data?.message) return data.message;
  if (data?.__raw) {
    const raw = String(data.__raw);
    // Log raw server response for debugging, but don't show tracebacks to users
    console.error("Server raw response:", raw);
    const looksLikeTraceback =
      raw.includes("Traceback") ||
      (raw.toLowerCase().includes("error") && raw.length > 200) ||
      /<\/?html>/i.test(raw);
    if (looksLikeTraceback) return "Server error. Please try again later.";
    // Otherwise return a truncated raw message (safe length)
    return raw.length > 200 ? raw.slice(0, 200) + "..." : raw;
  }
  return defaultMsg;
}

const authService = {
  /**
   * Register a new userjsjjsjjfjfj
   */
  register: async ({
    email,
    password,
    confirm_password,
    referral_code = "",
  }) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        confirm_password,
        referral_code,
      }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      const errMsg = getErrorMessage(data, "Registration failed");
      throw new Error(errMsg);
    }
    return data;
  },

  /**
   * Login a user
   */
  login: async ({ email, password }) => {
    const response = await fetch(`${API_BASE}/api/auth/token/pair`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      const errMsg = getErrorMessage(data, "Login failed");
      throw new Error(errMsg);
    }
    return data;
  },

  /**
   * Resend verification token (OTP)
   */
  resendOTP: async (email) => {
    const response = await fetch(`${API_BASE}/api/auth/resend-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      const errMsg = getErrorMessage(data, "Failed to resend token");
      throw new Error(errMsg);
    }
    return data;
  },

  /**
   * Verify verification token (OTP)
   */
  verifyOTP: async (email, token) => {
    const response = await fetch(`${API_BASE}/api/auth/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, token }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      const errMsg = getErrorMessage(data, "Verification failed");
      throw new Error(errMsg);
    }
    return data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      const errMsg = getErrorMessage(data, "Failed to request password reset");
      throw new Error(errMsg);
    }
    return data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async ({ email, token, password, confirm_password }) => {
    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, token, password, confirm_password }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      const errMsg = getErrorMessage(data, "Failed to reset password");
      throw new Error(errMsg);
    }
    return data;
  },
};

export default authService;
