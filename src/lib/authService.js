const API_BASE = "https://cheeseball-v2.vercel.app";

const authService = {
  /**
   * Register a new userjsjjsjjfjfj
   */
  register: async ({ email, password, confirm_password, referral_code = "" }) => {
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail?.[0]?.msg || data.detail || data.message || "Registration failed");
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail?.[0]?.msg || data.detail || data.message || "Login failed");
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail?.[0]?.msg || data.detail || data.message || "Failed to resend token");
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail?.[0]?.msg || data.detail || data.message || "Verification failed");
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail?.[0]?.msg || data.detail || data.message || "Failed to request password reset");
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
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail?.[0]?.msg || data.detail || data.message || "Failed to reset password");
    }
    return data;
  },
};

export default authService;
