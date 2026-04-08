# Cheeseball: Mobile Feature Porting Plan (Web to Mobile)

This document provides technical specifications for porting the latest "Tabbed" features from the Cheeseball web platform to the React Native/Expo mobile app.

## 1. User Interface: Market Dashboard (`CurrencyRates`)

The mobile app must replicate the "Market" tab's sophisticated sorting and filtering logic.

### Market Sub-Tabs
- **"Hot":** Shows a list of the most popular crypto assets based on recent trades or volume.
- **"Gainers":** Assets sorted dynamically by their 24h percentage change (highest to lowest).
- **"New":** Recently listed assets in the system.
- **"24h Vol":** Sorted by trading volume.

### Component Features (Portrait Mode Optimized)
- **Promo Banners:** Use horizontal `ScrollView` with `snapToInterval`. High-end gradient cards with glassmorphism overlays.
- **Quick Action Grid:** A grid of buttons for **Buy**, **Sell**, **Swap**, **Gift Card**, and **Invoicing**.
- **Asset List:** High-density list items. Each row must show:
  *   Icon (or first letter with color background).
  *   Symbol (e.g., BTC) + Name in small text.
  *   Price in NGN (formatted with commas).
  *   24h % Change (Green for +, Red for -) inside a rounded badge.

## 2. Admin Interface: Order Management (`AdminOrders`)

The admin mobile dashboard must maintain clear separation between crypto and gift card transactions.

### Order Segment Control
- **"Crypto" Tab:** Handles Buy, Sell, and Swap transactions. 
  *   Fields to show: `from_amount`, `to_amount`, `status`, `transaction_hash`, `email`.
- **"Gift Cards" Tab:** Specialized view for gift card trades.
  *   Fields to show: `card_type`, `amount`, `fiat_amount (NGN)`, `front/back image previews`.

### Status Management Logic
- **Borders/Indicators:** Each card uses a left-side colored border to show state:
  *   `Amber`: Pending/Waiting
  *   `Emerald`: Approved/Completed
  *   `Red`: Rejected/Canceled
- **Update Capability:** Admins must be able to change status directly from the mobile detail view, which should trigger a database update in the `transactions` or `gift_card_trades` table.

## 3. Admin Interface: Market Control (`AdminCurrencies`)

### Market Listing Filters
- **"Enabled" (Active):** Currently tradable assets.
- **"Archived" (Inactive):** Assets hidden from the user market but saved in the DB.

### Sync Engine
- Implementation of a "Sync Market" button that calls the CoinGecko API to refresh prices and change data for all tracked assets.
- Integrated search bar for finding specific coins in the master list.

---

### Implementation Recommendation:
Use **React Native Paper's SegmentedButtons** or a custom-designed **Tab Bar component** to maintain the "Bybit" premium aesthetic while switching between these sub-views.
