import imageCompression from "browser-image-compression";

export const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? ""
    : "https://cheeseball-v2.vercel.app";

const AUTH_PAGES = [
  "/login",
  "/signup",
  "/auth",
  "/verify-account",
  "/forgot-password",
];
const isOnAuthPage = () =>
  AUTH_PAGES.some((p) => window.location.pathname.startsWith(p));

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return { __raw: await response.text() };
}

/* ─── LocalStorage Token Store ─── */

export function setTokens(access) {
  if (access) localStorage.setItem("accessToken", access);
  else localStorage.removeItem("accessToken");
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user_email");
}

const AUTH_CREDENTIAL_PATHS = [
  "/api/auth/token/pair",
  "/api/auth/register",
  "/api/auth/verify-token",
  "/api/auth/verify-reset-token",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/resend-token",
];

function shouldAttemptRefresh(path, data) {
  if (AUTH_CREDENTIAL_PATHS.some((p) => path.startsWith(p))) return false;
  return true;
}

export async function request(path, options = {}, _isRetry = false) {
  const authHeaders = {};
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    authHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      accept: "application/json",
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...authHeaders,
      ...options.headers,
    },
  });
  const data = await parseResponse(response);

  if (response.status === 401 && !isOnAuthPage()) {
    clearTokens();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login?session_expired=true";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.message || data?.__raw || "Request failed",
    );
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

export const getCurrentUserStrict = () =>
  request("/api/auth/me", { method: "GET" });

export const getCurrentUser = () =>
  request("/api/auth/me", { method: "GET" }).catch(() => ({
    email: localStorage.getItem("user_email"),
  }));

export const getProfile = async () =>
  withFallback(async () => request("/api/auth/me", { method: "GET" }), {
    id: "unknown",
    email: localStorage.getItem("user_email") || "",
    full_name: "Account Owner",
    phone: "",
  });

export const getAccountStats = async () =>
  withFallback(async () => request("/api/auth/me/stats", { method: "GET" }), {
    totalTrades: 0,
    activeOrders: 0,
    totalVolume: "₦0",
  });

export const getCurrencies = async () =>
  normalizeListResponse(await request("/api/rates/assets"), []);

export const getUsdNgnRate = async () =>
  request("/api/rates/usd-ngn");

export const getUserPortfolio = async () =>
  withFallback(
    async () => normalizeListResponse(await request("/api/wallets"), []),
    [],
  );

export const validatePromoCode = async (code) =>
  withFallback(
    async () =>
      request("/api/promo-codes/validate", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    code?.trim().toUpperCase() === "CHEESE2025"
      ? { valid: true, discount: 1000, benefit: 1000 }
      : { valid: false, discount: 0, benefit: 0 },
  );

export const createTransaction = async (payload) =>
  withFallback(
    async () =>
      request("/api/broker/transactions", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    { id: crypto.randomUUID?.() || `txn-${Date.now()}`, ...payload },
  );

export const createGiftCardTrade = async (payload) =>
  withFallback(
    async () =>
      request("/api/gift-card-trades", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    { id: crypto.randomUUID?.() || `gift-${Date.now()}`, ...payload },
  );

export const getUserTransactions = async (page = 1) =>
  withFallback(
    async () => {
      const response = await request(`/api/broker/transactions?page=${page}`);
      return response;
    },
    { items: [], count: 0 },
  );

export const getUserGiftCardTrades = async () =>
  withFallback(
    async () =>
      normalizeListResponse(await request("/api/gift-card-trades"), []),
    [],
  );

export const getWallets = async () =>
  withFallback(
    async () => normalizeListResponse(await request("/api/wallets"), []),
    [],
  );

export const previewConversion = async (fromAsset, toAsset, fromAmount) =>
  request("/api/wallets/convert/preview", {
    method: "POST",
    body: JSON.stringify({
      from_asset: fromAsset,
      to_asset: toAsset,
      from_amount: fromAmount,
    }),
  });

export const executeConversion = async (payload) =>
  withFallback(
    async () =>
      request("/api/wallets/convert", {
        method: "POST",
        body: JSON.stringify(
          typeof payload === "string" ? { rate_lock_id: payload } : payload,
        ),
      }),
    {
      id: `conv-${Date.now()}`,
      status: "completed",
      created_at: new Date().toISOString(),
      ...payload,
    },
  );

export const getBeneficiaries = async () =>
  withFallback(
    async () =>
      normalizeListResponse(await request("/api/payouts/beneficiaries"), []),
    [],
  );

export const createDeposit = async (asset, amount, network) =>
  request("/api/wallets/deposits/create", {
    method: "POST",
    body: JSON.stringify({ asset, expected_amount: amount, ...(network ? { network } : {}) }),
  });

export const getDepositStatus = async (depositId) =>
  request(`/api/wallets/deposits/${depositId}`);

export const createWithdrawal = async (payload) =>
  withFallback(
    async () =>
      request("/api/wallets/withdrawals", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    {
      id: `wd-${Date.now()}`,
      status: "pending",
      created_at: new Date().toISOString(),
      ...payload,
    },
  );

export const getWithdrawalStatus = async (id) =>
  withFallback(async () => request(`/api/wallets/withdrawals/${id}`), {
    id,
    status: "pending",
    amount: 25000,
    bank_name: "Demo Bank",
    bank_account_name: "Cheeseball User",
    bank_account_number: "0123456789",
    created_at: new Date().toISOString(),
  });

export const uploadFile = async (file, folder = "uploads") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return withFallback(async () => {
    const data = await request("/api/uploads", {
      method: "POST",
      body: formData,
    });
    return data.url || data.public_url || data.file_url || data.path;
  }, URL.createObjectURL(file));
};

export const uploadToCloudinary = async (file) => {
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append(
      "upload_preset",
      "cheeseball"
    );

    const cloudName = "dahz436mo";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

/* ─── Buy Crypto Flow ─── */

export const getBuyQuote = async (asset, cryptoAmount, nairaAmount = null) =>
  request("/api/rates/buy-quote", {
    method: "POST",
    body: JSON.stringify({ asset, crypto_amount: cryptoAmount, naira_amount: nairaAmount }),
  });

export const createBuyTransaction = async (quoteId, paymentMethod, opts = {}) =>
  request("/api/broker/buy", {
    method: "POST",
    body: JSON.stringify({
      quote_id: quoteId,
      payment_method: paymentMethod,
      ...opts,
    }),
  });

export const setupPayment = async (transactionId, paymentMethod) =>
  request("/api/payments/setup", {
    method: "POST",
    body: JSON.stringify({
      transaction_id: transactionId,
      payment_method: paymentMethod,
    }),
  });

export const getPaymentInstructions = async () =>
  request("/api/payments/instructions");

export const submitBankTransferProof = async (
  transactionId,
  receiptReference,
  receiptUrl,
) =>
  request(`/api/payments/transactions/${transactionId}/bank-transfer/submit`, {
    method: "POST",
    body: JSON.stringify({
      receipt_reference: receiptReference,
      receipt_url: receiptUrl,
    }),
  });

export const getBuyTransactionStatus = async (transactionId) =>
  request(`/api/broker/transactions/${transactionId}`);

/* ─── Sell Crypto Flow ─── */

export const getSellQuote = async (asset, cryptoAmount, nairaAmount = null) =>
  request("/api/rates/sell-quote", {
    method: "POST",
    body: JSON.stringify({
      asset,
      crypto_amount: cryptoAmount,
      naira_amount: nairaAmount,
    }),
  });

export const createSellTransaction = async (payload) =>
  request("/api/broker/sell", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const confirmSellCryptoSent = async (transactionId) =>
  request(`/api/broker/transactions/${transactionId}/confirm-crypto-sent`, {
    method: "POST",
  });

export const getBeneficiaryBankAccounts = async () =>
  withFallback(
    async () =>
      normalizeListResponse(await request("/api/payouts/beneficiaries"), []),
    [],
  );

export const createBeneficiaryBankAccount = async (payload) =>
  request("/api/payouts/beneficiaries", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteBeneficiaryBankAccount = async (id) =>
  request(`/api/payouts/beneficiaries/${id}`, {
    method: "DELETE",
  });

export const getReferralData = async () => {
  const data = await request("/api/auth/referral");
  if (data && data.referral_code) {
    data.referral_link = `https://www.cheeseballapp.com/register?ref=${data.referral_code}`;
  }
  return data;
};

/* ─── Send Crypto Flow ─── */

export const lookupUser = async (query) =>
  request(`/api/auth/users/lookup?email=${encodeURIComponent(query)}`);

export const sendCrypto = async (payload) =>
  request("/api/transfers/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getTransfers = async () =>
  withFallback(
    async () => normalizeListResponse(await request("/api/transfers/"), []),
    [],
  );

/* ─── KYC Verification ─── */

export const submitKYC = async (payload) =>
  request("/api/kyc/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMyKYC = async () =>
  request("/api/kyc/me", { method: "GET" });

/* ─── Notifications ─── */

export const getNotifications = async () =>
  withFallback(
    async () =>
      normalizeListResponse(
        await request("/api/notifications", { method: "GET" }),
        [],
      ),
    [],
  );

export const markNotificationAsRead = async (notificationId) =>
  request(`/api/notifications/${notificationId}/read`, {
    method: "POST",
  });

export const markAllNotificationsAsRead = async () =>
  request("/api/notifications/read-all", {
    method: "POST",
  });

export const fundNGNWallet = async (amount) =>
  withFallback(
    async () =>
      request("/api/wallets/fund/ngn", {
        method: "POST",
        body: JSON.stringify({ amount }),
      }),
    { success: false },
  );
