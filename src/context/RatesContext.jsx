/**
 * RatesContext — Global live-rate store
 *
 * Fetches buy-quote rates for every supported asset from the backend on mount,
 * caches results for CACHE_TTL ms, then auto-refreshes.
 *
 * Nigerian display format: ₦X,XXX/$ — meaning you pay X naira for every $1
 * worth of that asset (the `final_rate` field from /api/rates/buy-quote).
 *
 * Shape of `rates` map:
 *   {
 *     BTC: {
 *       symbol:        "BTC",
 *       name:          "Bitcoin",
 *       icon:          "₿",
 *       color:         "#F7931A",
 *       buyRate:       1400.82,         // ₦ per $1 (final_rate from backend)
 *       buyNGN:        86116809.12,     // ₦ per 1 whole unit (crypto_usd_price × buyRate)
 *       usdPrice:      61476.00,        // USD price of 1 unit (from backend)
 *       markupPercent: 3.00,
 *     },
 *     USDT: { ... },
 *     ...
 *   }
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { getBuyQuote } from "@/services/api";

/* ── Assets the backend computes rates for ─────────────────────── */
export const MARKET_ASSETS = [
  { symbol: "BTC",  name: "Bitcoin",   icon: "₿", color: "#F7931A", bg: "#FEF3E2" },
  { symbol: "USDT", name: "Tether",    icon: "₮", color: "#26A17B", bg: "#E6F7F2" },
  { symbol: "ETH",  name: "Ethereum",  icon: "Ξ", color: "#627EEA", bg: "#EEEFFE" },
  { symbol: "USDC", name: "USD Coin",  icon: "$", color: "#2775CA", bg: "#E6F0FA" },
  { symbol: "SOL",  name: "Solana",    icon: "◎", color: "#9945FF", bg: "#F1E9FF" },
  { symbol: "BNB",  name: "BNB",       icon: "⬡", color: "#F0B90B", bg: "#FEF8E6" },
];

const CACHE_TTL       = 5 * 60 * 1000; // 5 minutes
const REFRESH_INTERVAL = 5 * 60 * 1000;

/* ── Context & hook ─────────────────────────────────────────────── */
const RatesContext = createContext(null);

export function useRates() {
  const ctx = useContext(RatesContext);
  if (!ctx) throw new Error("useRates must be used inside <RatesProvider>");
  return ctx;
}

/* ── Provider ───────────────────────────────────────────────────── */
export function RatesProvider({ children }) {
  const [rates, setRates]           = useState({});
  const [isLoading, setIsLoading]   = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const cacheRef = useRef({ ts: 0, data: {} });

  const fetchRates = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - cacheRef.current.ts < CACHE_TTL) return;

    try {
      // Fetch a small reference quote (₦100,000) per asset so the backend
      // computes the current final_rate (NGN per $1) and crypto_usd_price.
      const results = await Promise.all(
        MARKET_ASSETS.map((a) =>
          getBuyQuote(a.symbol, 100000)
            .then((res) => {
              console.log(`[RatesContext] ${a.symbol} raw response:`, res);
              return res;
            })
            .catch((err) => {
              console.warn(`[RatesContext] ${a.symbol} fetch failed:`, err?.message || err);
              return null;
            }),
        ),
      );

      const newRates = {};
      MARKET_ASSETS.forEach((asset, i) => {
        const q = results[i];
        if (q) {
          const buyRate     = parseFloat(q.final_rate)        || 0;
          const usdPrice    = parseFloat(q.crypto_usd_price)  || 0;
          newRates[asset.symbol] = {
            symbol:        asset.symbol,
            name:          asset.name,
            icon:          asset.icon,
            color:         asset.color,
            bg:            asset.bg,
            buyRate,                              // ₦ per $1  e.g. 1400.82
            buyNGN:        usdPrice * buyRate,    // ₦ per 1 unit
            usdPrice,                             // $ per 1 unit
            markupPercent: parseFloat(q.markup_percent) || 0,
          };
        } else {
          // Fallback skeleton so UI never crashes
          newRates[asset.symbol] = {
            symbol:        asset.symbol,
            name:          asset.name,
            icon:          asset.icon,
            color:         asset.color,
            bg:            asset.bg,
            buyRate:       null,
            buyNGN:        null,
            usdPrice:      null,
            markupPercent: null,
          };
        }
      });

      cacheRef.current = { ts: now, data: newRates };
      setRates(newRates);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("RatesContext: failed to fetch rates", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(true);
    const interval = setInterval(() => fetchRates(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRates]);

  /** Convenience: get the NGN/$ rate for a specific symbol, with a fallback */
  const getBuyRateFor = useCallback(
    (symbol, fallback = 0) => rates[symbol]?.buyRate ?? fallback,
    [rates],
  );

  /** Convenience: get NGN price of 1 whole unit for a symbol */
  const getBuyNGNFor = useCallback(
    (symbol, fallback = 0) => rates[symbol]?.buyNGN ?? fallback,
    [rates],
  );

  return (
    <RatesContext.Provider
      value={{
        rates,          // full map — { BTC: {...}, USDT: {...}, ... }
        isLoading,
        lastUpdated,
        refresh: () => fetchRates(true),
        getBuyRateFor,
        getBuyNGNFor,
      }}
    >
      {children}
    </RatesContext.Provider>
  );
}
