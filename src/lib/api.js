import { supabase } from './supabaseClient';

// --- Profiles ---
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  return { data, error };
};

// --- Currencies ---
export const getCurrencies = async () => {
  const { data, error } = await supabase
    .from('currencies')
    .select('*')
    .order('is_active', { ascending: false })
    .order('name', { ascending: true });
  return { data, error };
};

export const createCurrency = async (currencyData) => {
  const { data, error } = await supabase
    .from('currencies')
    .insert([currencyData])
    .select();
  return { data, error };
};

export const updateCurrency = async (id, updates) => {
  const { data, error } = await supabase
    .from('currencies')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

// --- Transactions / Orders ---
export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      profiles:user_id (full_name, email),
      from_currency:currencies!from_currency_id (symbol, icon_url),
      to_currency:currencies!to_currency_id (symbol, icon_url)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getUserTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      from_currency:currencies!from_currency_id (symbol, icon_url),
      to_currency:currencies!to_currency_id (symbol, icon_url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getTransactionsByStatus = async (status) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateTransactionStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', id)
    .select();
  return { data, error };
};

export const createTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select();
  return { data, error };
};

export const getUserPortfolio = async (userId) => {
  // Reuse the existing getUserTransactions fetch
  const { data: transactions, error } = await getUserTransactions(userId);
  
  if (error) return { data: null, error };
  if (!transactions) return { data: {}, error: null };

  const portfolio = {};

  transactions.forEach(t => {
    // Only count approved transactions for balance
    // Note: status casing varies, let's normalize or assume 'approved' or 'Approved' based on other files
    // AdminOrders.jsx maps statuses to capitalized. Database default is lower case 'waiting', 'approved'.
    if (t.status?.toLowerCase() !== 'approved') return;

    // Add incoming (To)
    if (t.to_currency?.symbol && t.to_amount) {
      const sym = t.to_currency.symbol;
      portfolio[sym] = (portfolio[sym] || 0) + Number(t.to_amount);
    }

    // Subtract outgoing (From)
    if (t.from_currency?.symbol && t.from_amount) {
      const sym = t.from_currency.symbol;
      portfolio[sym] = (portfolio[sym] || 0) - Number(t.from_amount);
    }
  });

  return { data: portfolio, error: null };
};

// --- Notifications ---
export const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getUserNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createNotification = async (notificationData) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select();
  return { data, error };
};

// --- Income Logs ---
export const getIncomeLogs = async () => {
  const { data, error } = await supabase
    .from('income_logs')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

// --- System Status ---
export const getSystemStatus = async () => {
  const { data, error } = await supabase
    .from('system_status')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
};

// --- Admin Stats (Aggregated) ---
export const getAdminStats = async () => {
  // Ideally, use Supabase RPC for complex aggregations, but doing simple fetches here for now
  const { count: orderCount } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true });

  const { count: currencyCount } = await supabase
    .from('currencies')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Calculate volume (mock logic - in real app, sum transaction amounts)
  const volume = "5,824k"; 

  return {
    orderCount: orderCount || 0,
    currencyCount: currencyCount || 0,
    volume
  };
};
