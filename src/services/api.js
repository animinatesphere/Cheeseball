import { demoCurrencies, demoPortfolio, demoTransactions, demoUser } from "./demoData";

export const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? ""
    : "https://cheeseball-v2.vercel.app";


const ok = (data) => Promise.resolve({ data, error: null });
const getAccessToken = () => localStorage.getItem("access_token");

const authHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return { __raw: await response.text() };
}

async function request(path, options = {}) {
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
  Promise.resolve({
    ...demoUser,
    email: localStorage.getItem("user_email") || demoUser.email,
  });

export const getProfile = async () =>
  withFallback(
    async () => request("/api/users/me"),
    {
      id: demoUser.id,
      email: localStorage.getItem("user_email") || demoUser.email,
      full_name: "Account Owner",
      phone: "",
    },
  );

export const getAccountStats = async () =>
  withFallback(
    async () => request("/api/users/me/stats"),
    { totalTrades: demoTransactions.length, activeOrders: 0, totalVolume: "₦5.2M" },
  );

export const getCurrencies = async () =>
  ok(await withFallback(async () => normalizeListResponse(await request("/api/currencies"), demoCurrencies), demoCurrencies));

export const getUserPortfolio = async () =>
  ok(await withFallback(async () => normalizeListResponse(await request("/api/wallets"), demoPortfolio), demoPortfolio));

export const validatePromoCode = async (code) =>
  ok(
    await withFallback(
      async () => request("/api/promo-codes/validate", { method: "POST", body: JSON.stringify({ code }) }),
      code?.trim().toUpperCase() === "CHEESE2025"
        ? { valid: true, discount: 1000, benefit: 1000 }
        : { valid: false, discount: 0, benefit: 0 },
    ),
  );

export const createTransaction = async (payload) =>
  ok(
    await withFallback(
      async () => request("/api/broker/transactions", { method: "POST", body: JSON.stringify(payload) }),
      { id: crypto.randomUUID?.() || `txn-${Date.now()}`, ...payload },
    ),
  );

export const createGiftCardTrade = async (payload) =>
  ok(
    await withFallback(
      async () => request("/api/gift-card-trades", { method: "POST", body: JSON.stringify(payload) }),
      { id: crypto.randomUUID?.() || `gift-${Date.now()}`, ...payload },
    ),
  );

export const getUserTransactions = async () =>
  ok(await withFallback(async () => normalizeListResponse(await request("/api/broker/transactions"), demoTransactions), demoTransactions));

export const getUserGiftCardTrades = async () =>
  ok(await withFallback(async () => normalizeListResponse(await request("/api/gift-card-trades"), []), []));

export const getWallets = async () =>
  withFallback(
    async () => normalizeListResponse(await request("/api/wallets"), []),
    [
      { asset: "NGN", balance: 142000, available_balance: 142000 },
      { asset: "BTC", balance: 0.00412, available_balance: 0.00412 },
      { asset: "USDT", balance: 245.5, available_balance: 245.5 },
      { asset: "ETH", balance: 0.12, available_balance: 0.12 },
    ],
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
  ok(await withFallback(async () => normalizeListResponse(await request("/api/payouts/beneficiaries"), []), []));

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

