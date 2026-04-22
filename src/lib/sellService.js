import { supabase } from "./supabaseClient";

const API_BASE = "https://cheeseball-v2.vercel.app/api";

const getHeaders = async () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export const sellService = {
  // Payouts / Beneficiaries
  getBeneficiaries: async () => {
    const response = await fetch(`${API_BASE}/payouts/beneficiaries`, {
      method: "GET",
      headers: await getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch beneficiaries");
    return response.json();
  },

  createBeneficiary: async (payload) => {
    const response = await fetch(`${API_BASE}/payouts/beneficiaries`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create beneficiary");
    return response.json();
  },

  // Rates / Quotes
  createSellQuote: async (payload) => {
    const response = await fetch(`${API_BASE}/rates/sell-quote`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create sell quote");
    return response.json();
  },

  // Broker / Transactions
  createSellTransaction: async (payload) => {
    const response = await fetch(`${API_BASE}/broker/sell`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to create sell transaction");
    return response.json();
  },

  confirmCryptoSent: async (transactionId) => {
    const response = await fetch(`${API_BASE}/broker/transactions/${transactionId}/confirm-crypto-sent`, {
      method: "POST",
      headers: await getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to confirm crypto sent");
    return response.json();
  },

  getTransactionStatus: async (transactionId) => {
    const response = await fetch(`${API_BASE}/broker/transactions/${transactionId}`, {
      method: "GET",
      headers: await getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch transaction status");
    return response.json();
  },
};
