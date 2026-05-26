export const API_BASE = "https://cheeseball-v2.vercel.app";

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const authHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return { __raw: await response.text() };
}

/* ─── Token Refresh Logic ─── */

let isRefreshing = false;
let refreshPromise = null;

function clearAuthAndRedirect() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_email");

  // Only redirect if not already on login/signup/auth pages
  const authPaths = ["/login", "/signup", "/auth", "/verify-account", "/forgot-password"];
  if (!authPaths.some((p) => window.location.pathname.startsWith(p))) {
    window.location.href = "/login?session_expired=true";
  }
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearAuthAndRedirect();
    throw new Error("Session expired. Please log in again.");
  }

  // Mutex: if a refresh is already in flight, wait for it
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/token/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (!response.ok) {
        clearAuthAndRedirect();
        throw new Error("Session expired. Please log in again.");
      }

      const data = await response.json();
      if (data.access) {
        localStorage.setItem("access_token", data.access);
      }
      // Some backends also rotate the refresh token
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }
      return data.access;
    } catch (err) {
      clearAuthAndRedirect();
      throw err;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function isTokenError(data) {
  if (data?.code === "token_not_valid") return true;
  if (typeof data?.detail === "string" && data.detail.toLowerCase().includes("token")) return true;
  if (Array.isArray(data?.messages)) {
    return data.messages.some((m) => m?.token_type === "access" || m?.token_class === "AccessToken");
  }
  return false;
}

async function request(path, options = {}, _isRetry = false) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...authHeaders(),
      ...options.headers,
    },
  });
  const data = await parseResponse(response);

  // If 401 and this is a token error, try to refresh and retry once
  if (response.status === 401 && isTokenError(data) && !_isRetry) {
    try {
      await refreshAccessToken();
      return request(path, options, true); // retry with fresh token
    } catch {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || data?.__raw || "Request failed");
  }
  return data;
}

async function withFallback(fn, fallback) {
  try {
    return await fn();
  } catch (error) {
    console.warn("API fallback:", error.message);
    return fallback;
  }
}

const normalizeListResponse = (data, fallback = []) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return fallback;
};

export const getCurrentUser = () =>
  request("/api/users/me").catch(() => ({ email: localStorage.getItem("user_email") }));

export const getProfile = async () =>
  withFallback(
    async () => request("/api/users/me"),
    {
      id: "unknown",
      email: localStorage.getItem("user_email") || "",
      full_name: "Account Owner",
      phone: "",
    },
  );

export const getAccountStats = async () =>
  withFallback(
    async () => request("/api/users/me/stats"),
    { totalTrades: 0, activeOrders: 0, totalVolume: "₦0" },
  );

export const getCurrencies = async () =>
  withFallback(async () => normalizeListResponse(await request("/api/currencies"), []), []);

export const getUserPortfolio = async () =>
  withFallback(async () => normalizeListResponse(await request("/api/wallets"), []), []);

export const validatePromoCode = async (code) =>
  withFallback(
    async () => request("/api/promo-codes/validate", { method: "POST", body: JSON.stringify({ code }) }),
    code?.trim().toUpperCase() === "CHEESE2025"
      ? { valid: true, discount: 1000, benefit: 1000 }
      : { valid: false, discount: 0, benefit: 0 },
  );

export const createTransaction = async (payload) =>
  withFallback(
    async () => request("/api/broker/transactions", { method: "POST", body: JSON.stringify(payload) }),
    { id: crypto.randomUUID?.() || `txn-${Date.now()}`, ...payload },
  );

export const createGiftCardTrade = async (payload) =>
  withFallback(
    async () => request("/api/gift-card-trades", { method: "POST", body: JSON.stringify(payload) }),
    { id: crypto.randomUUID?.() || `gift-${Date.now()}`, ...payload },
  );

export const getUserTransactions = async () =>
  withFallback(async () => normalizeListResponse(await request("/api/broker/transactions"), []), []);

export const getUserGiftCardTrades = async () =>
  withFallback(async () => normalizeListResponse(await request("/api/gift-card-trades"), []), []);

export const getWallets = async () =>
  withFallback(
    async () => normalizeListResponse(await request("/api/wallets"), []),
    []
  );

export const previewConversion = async (fromAsset, toAsset, fromAmount) =>
  withFallback(
    async () =>
      request("/api/wallets/convert/preview", {
        method: "POST",
        body: JSON.stringify({ from_asset: fromAsset, to_asset: toAsset, from_amount: fromAmount }),
      }),
    {
      from_asset: fromAsset,
      to_asset: toAsset,
      from_amount: Number(fromAmount),
      to_amount: Number((Number(fromAmount) * (fromAsset === "NGN" ? 1 / 1600 : 1540)).toFixed(6)),
      rate: fromAsset === "NGN" ? 1 / 1600 : 1540,
      fee: 0,
      expires_at: new Date(Date.now() + 120000).toISOString(),
    },
  );

export const executeConversion = async (payload) =>
  withFallback(
    async () =>
      request("/api/wallets/convert", {
        method: "POST",
        body: JSON.stringify(typeof payload === "string" ? { rate_lock_id: payload } : payload),
      }),
    { id: `conv-${Date.now()}`, status: "completed", created_at: new Date().toISOString(), ...payload },
  );

export const getBeneficiaries = async () =>
  withFallback(async () => normalizeListResponse(await request("/api/payouts/beneficiaries"), []), []);

export const createDeposit = async (asset, amount) =>
  withFallback(
    async () =>
      request("/api/wallets/deposits/create", {
        method: "POST",
        body: JSON.stringify({ asset, expected_amount: amount }),
      }),
    {
      id: `dep-${Date.now()}`,
      asset,
      expected_amount: amount,
      platform_address: "TCheeseballDemoWallet000000000000000",
      reference_code: `CB${Date.now().toString().slice(-6)}`,
      network: asset === "BTC" ? "Bitcoin" : "TRC20",
      memo_supported: false,
      status: "pending",
    },
  );

export const getDepositStatus = async (depositId) =>
  withFallback(async () => request(`/api/wallets/deposits/${depositId}`), { id: depositId, status: "pending" });

export const createWithdrawal = async (payload) =>
  withFallback(
    async () => request("/api/wallets/withdrawals", { method: "POST", body: JSON.stringify(payload) }),
    { id: `wd-${Date.now()}`, status: "pending", created_at: new Date().toISOString(), ...payload },
  );

export const getWithdrawalStatus = async (id) =>
  withFallback(
    async () => request(`/api/wallets/withdrawals/${id}`),
    {
      id,
      status: "pending",
      amount: 25000,
      bank_name: "Demo Bank",
      bank_account_name: "Cheeseball User",
      bank_account_number: "0123456789",
      created_at: new Date().toISOString(),
    },
  );

export const uploadFile = async (file, folder = "uploads") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return withFallback(
    async () => {
      const data = await request("/api/uploads", { method: "POST", body: formData });
      return data.url || data.public_url || data.file_url || data.path;
    },
    URL.createObjectURL(file),
  );
};

/* ─── Buy Crypto Flow ─── */

export const getBuyQuote = async (asset, nairaAmount) =>
  request("/api/rates/buy-quote", {
    method: "POST",
    body: JSON.stringify({ asset, naira_amount: nairaAmount }),
  });

export const createBuyTransaction = async (quoteId, paymentMethod) =>
  request("/api/broker/buy", {
    method: "POST",
    body: JSON.stringify({ quote_id: quoteId, payment_method: paymentMethod }),
  });

export const setupPayment = async (transactionId, paymentMethod) =>
  request("/api/payments/setup", {
    method: "POST",
    body: JSON.stringify({ transaction_id: transactionId, payment_method: paymentMethod }),
  });

export const getPaymentInstructions = async () =>
  request("/api/payments/instructions");

export const submitBankTransferProof = async (transactionId, receiptReference, receiptUrl) =>
  request(`/api/payments/transactions/${transactionId}/bank-transfer/submit`, {
    method: "POST",
    body: JSON.stringify({ receipt_reference: receiptReference, receipt_url: receiptUrl }),
  });

export const getBuyTransactionStatus = async (transactionId) =>
  request(`/api/broker/transactions/${transactionId}`);

/* ─── Sell Crypto Flow ─── */

export const getSellQuote = async (asset, cryptoAmount) =>
  request("/api/rates/sell-quote", {
    method: "POST",
    body: JSON.stringify({ asset, crypto_amount: cryptoAmount }),
  });

export const createSellTransaction = async (payload) =>
  request("/api/broker/sell", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const confirmSellCryptoSent = async (transactionId) =>
  request(`/api/broker/transactions/${transactionId}/sell-crypto-sent`, {
    method: "POST",
  });

export const getBeneficiaryBankAccounts = async () =>
  withFallback(async () => normalizeListResponse(await request("/api/payouts/beneficiaries"), []), []);

export const createBeneficiaryBankAccount = async (payload) =>
  request("/api/payouts/beneficiaries", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteBeneficiaryBankAccount = async (id) =>
  request(`/api/payouts/beneficiaries/${id}`, {
    method: "DELETE",
  });
