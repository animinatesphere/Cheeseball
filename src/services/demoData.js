export const demoUser = {
  id: "demo-user",
  email: "user@cheeseball.io",
};

export const demoCurrencies = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    is_active: true,
    buy_rate: 94050000,
    sell_rate: 92800000,
    network: "Bitcoin",
    wallet_address: "bc1qcheeseballdemowallet0000000000000",
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    is_active: true,
    buy_rate: 4872000,
    sell_rate: 4810000,
    network: "ERC20",
    wallet_address: "0xCheeseballDemoWallet00000000000000000000",
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    is_active: true,
    buy_rate: 1600,
    sell_rate: 1540,
    network: "TRC20",
    wallet_address: "TCheeseballDemoWallet000000000000000",
  },
  {
    id: "ngn",
    symbol: "NGN",
    name: "Naira",
    is_active: true,
    buy_rate: 1,
    sell_rate: 1,
    network: "Bank",
  },
];

export const demoPortfolio = [
  { currency_id: "btc", balance: 0.00412, currency: demoCurrencies[0] },
  { currency_id: "usdt", balance: 245.5, currency: demoCurrencies[2] },
  { currency_id: "ngn", balance: 142000, currency: demoCurrencies[3] },
];

export const demoTransactions = [
  {
    id: "txn-1",
    exchange_id: "ID:DEMO0001",
    type: "sell",
    status: "completed",
    from_amount: 100,
    to_amount: 154000,
    created_at: new Date().toISOString(),
  },
  {
    id: "txn-2",
    exchange_id: "ID:DEMO0002",
    type: "buy",
    status: "pending",
    from_amount: 75000,
    to_amount: 45,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

