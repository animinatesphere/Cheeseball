-- Seed common currencies
INSERT INTO public.currencies (name, symbol, price, change_24h, is_positive, icon_url, color_class, is_active)
VALUES
  ('Bitcoin', 'BTC', 65000.00, '+2.4%', true, 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', 'bg-orange-500', true),
  ('Ethereum', 'ETH', 3500.00, '+1.2%', true, 'https://cryptologos.cc/logos/ethereum-eth-logo.png', 'bg-blue-600', true),
  ('Tether', 'USDT', 1.00, '+0.01%', true, 'https://cryptologos.cc/logos/tether-usdt-logo.png', 'bg-green-500', true),
  ('USD Coin', 'USDC', 1.00, '0.00%', true, 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', 'bg-blue-400', true),
  ('Nigerian Naira', 'NGN', 0.00065, '-0.5%', false, null, 'bg-green-700', true),
  ('Solana', 'SOL', 145.00, '+5.4%', true, 'https://cryptologos.cc/logos/solana-sol-logo.png', 'bg-purple-600', true),
  ('Binance Coin', 'BNB', 600.00, '+0.8%', true, 'https://cryptologos.cc/logos/bnb-bnb-logo.png', 'bg-yellow-500', true);
