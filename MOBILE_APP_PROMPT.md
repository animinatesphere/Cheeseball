# Cheeseball Mobile App Development Prompt

Copy and paste the following prompt into ChatGPT or any AI assistant to help you build the mobile version of your project.

---

### PROJECT COMMENCEMENT: CHEESEBALL MOBILE (RE-DESIGN & PORT)

I have a web application called "Cheeseball" (a premium crypto/gift card exchange). I want to port its features to a mobile application (React Native/Expo) while adding features inspired by the "Breet" app. 

#### 1. Core Aesthetic & Brand Identity:
- **Style:** "Bybit-inspired" Premium/Institutional feel.
- **Main Colors:** 
  - Background: #0B0E11
  - Primary Accent: #FFB11A (Gold/Orange)
  - Surface/Cards: #1E2329
  - Text: #EAECEF
- **Elements:** High-end typography (Inter/Outfit), 3D assets, glassmorphism, and smooth transitions. Use hardcoded hex values for consistency.

#### 2. Features to Port from Web:
- **Authentication:** Login, Signup, and OTP verification screens.
- **Home Dashboard:** Quick actions (Buy, Sell, Swap, Gift Card), Balance overview, and a **Tabbed Live Ticker** (Hot, Gainers, New, 24h Vol).
- **Convert (Swap) Engine:** A "Bybit-style" conversion UI where users select 'From' and 'To' assets with real-time rate calculation, plus a integrated Promo Code system.
- **History Page:** A refined transaction list with status badges and detailed views.
- **Gift Card Hub:** Image upload functionality for card proofs and a rate calculator for 20+ card types.
- **Admin Orders:** A dual-tab system for managing **Crypto Transactions** and **Gift Card Trades** separately, with status update capabilities (Pending, Completed, Rejected).
- **Admin Market Management:** A dashboard to Sync prices with CoinGecko, search assets, and toggle "Active/Archived" states.

#### 3. New "Breet" Style Features:
- **Automated Payouts:** Implementation logic for instant settlement to bank accounts (via APIs like Paystack/Flutterwave).
- **Bill Payments:** Integration for Airtime, Data, and Utility payments directly from the wallet.
- **Crypto Invoicing:** A feature to generate "Pay Me" links/QR codes for receiving crypto that auto-converts to cash.

#### 4. Technical Constraints:
- **Frontend Framework:** React Native / Expo.
- **Backend Infrastructure:** Supabase (Auth, Database, Storage).
- **Icons:** Use `lucide-react-native`.
- **Navigation:** Standard bottom tab navigation + stack navigation for flows.

#### YOUR TASK:
I need you to act as an expert Mobile Architect. Help me design and implement the code for the [SPECIFY SCREEN, e.g., Swap Page] ensuring it follows the premium dark-mode aesthetic described above. Provide code that is clean, modular, and performance-optimized. 

---

## Technical Context for reference:

**Design Tokens:**
- BG: `#0B0E11`
- Surface: `#181A20`
- Card: `#1E2329`
- Highlight: `#2B3139`
- Accent: `#FFB11A`

**Current Features Workflow:**
1. **User Auth:** Email/Password -> OTP -> Dashboard.
2. **Swap:** Select Asset 'A' -> Input Amount -> Auto-calculate Asset 'B' (based on current price) -> Confirm -> Database Transaction.
3. **Gift Card:** Select Brand -> Select Country/Category -> Upload Proof -> Admin Review -> Credit Wallet.
4. **Breet Feature Addition:** Add 'Utility' tab for Bill Payments and 'Invoice' tab for payment links.

**5. Tabbed Logic to Port:**
- **Market (User):** Implement filtering tabs for `Hot` (default), `Gainers` (sorted by % change), `New` (recently added), and `24h Vol` (sorted by volume). Each entry shows Symbol, Icon, Price (NGN), and 24h Change.
- **Admin Orders:** Use a top-level segment control to switch between `Crypto` orders (Buy/Sell/Swap) and `Gift Card` trades. Each card should show status-colored borders and transaction summaries.
- **Admin Currencies:** Implement `Enabled` and `Archived` filters to manage the visibility of trading pairs.
