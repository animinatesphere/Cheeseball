# Cheeseball - Cryptocurrency Exchange Platform

A modern, full-stack cryptocurrency exchange platform designed specifically for Nigerian users. Cheeseball enables seamless buying, selling, and swapping of cryptocurrencies with local payment methods and real-time market data.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Authentication System](#authentication-system)
- [Payment Processing](#payment-processing)
- [Admin Dashboard](#admin-dashboard)
- [Routing & Navigation](#routing--navigation)
- [Deployment](#deployment)

---

## 🎯 Project Overview

**Cheeseball** is a premium cryptocurrency exchange platform that simplifies crypto trading for Nigerian users. It provides:

- Easy-to-use interface for buying, selling, and swapping cryptocurrencies
- Fast, automated transaction processing
- Bank-grade security with Supabase infrastructure
- Support for Nigerian Naira (NGN) via Paystack payment gateway
- Real-time cryptocurrency prices from CoinGecko
- Separate interfaces for regular users and administrators
- Comprehensive transaction management and history tracking

### Target Users

- **Regular Users**: Nigerians wanting to buy, sell, or exchange cryptocurrencies with fiat currency
- **Admin Users**: Platform administrators managing currencies, orders, and system operations

---

## 🛠 Technology Stack

### Frontend

| Technology           | Version | Purpose                                        |
| -------------------- | ------- | ---------------------------------------------- |
| **React**            | 19.2.0  | UI library for building interactive components |
| **React Router DOM** | 7.11.0  | Client-side routing and navigation             |
| **Vite**             | 7.2.4   | Lightning-fast build tool and dev server       |
| **Tailwind CSS**     | 4.1.18  | Utility-first CSS framework for styling        |
| **Lucide React**     | 0.562.0 | Beautiful icon library                         |

### Backend & Data

| Technology        | Version  | Purpose                               |
| ----------------- | -------- | ------------------------------------- |
| **Supabase**      | 2.95.3   | PostgreSQL database with auth and RLS |
| **Supabase Auth** | Built-in | OTP-based magic link authentication   |

### Third-Party Integrations

| Service           | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| **Paystack**      | Payment processing for fiat transactions        |
| **CoinGecko API** | Real-time cryptocurrency prices and market data |

### Development Tools

| Tool          | Version | Purpose                  |
| ------------- | ------- | ------------------------ |
| **ESLint**    | 9.39.1  | Code quality linting     |
| **Babel/Oxc** | Latest  | JavaScript transpilation |

---

## 📂 Project Structure

```
cheeseball/
├── public/                          # Static assets
├── src/
│   ├── main.jsx                     # React application entry point
│   ├── App.jsx                      # Root component with auth state
│   ├── Routee.jsx                   # Application routing configuration
│   │
│   ├── admin/                       # Admin dashboard interface
│   │   ├── auth/
│   │   │   └── CheeseBallLogin.jsx  # Admin login page
│   │   ├── pages/
│   │   │   └── AdminDashboard.jsx   # Admin main dashboard
│   │   └── component/
│   │       ├── AdminBottomNav.jsx
│   │       ├── AdminDashboardHome.jsx
│   │       ├── AdminCurrencies.jsx   # Currency management
│   │       ├── AdminOrders.jsx       # Order management
│   │       ├── AdminHistory.jsx
│   │       ├── AdminAccount.jsx
│   │       ├── AdminAddCurrencyModal.jsx
│   │       └── account/              # Admin account features
│   │
│   ├── user/                        # User-facing interface
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Public homepage
│   │   │   ├── Auth.jsx             # OTP login page
│   │   │   ├── Signup.jsx           # User registration
│   │   │   ├── CurrencyPage.jsx     # Main trading dashboard
│   │   │   ├── CurrencyRates.jsx    # Exchange rates view
│   │   │   └── Home.jsx
│   │   └── components/              # Trading components (20+ files)
│   │       ├── SwapCrypto.jsx
│   │       ├── BuyCryptocurrency.jsx
│   │       ├── CryptoExchangeModal.jsx
│   │       ├── ConfirmSwap.jsx
│   │       ├── BankTransferDetails.jsx
│   │       └── ... (more trading components)
│   │
│   ├── page/                        # Onboarding pages
│   │   ├── Onboarding.jsx
│   │   ├── Welcome.jsx
│   │   ├── BuyCrypto.jsx
│   │   ├── SellCrypto.jsx
│   │   └── SeamCrypto.jsx
│   │
│   ├── lib/                         # Core libraries
│   │   ├── supabaseClient.js        # Supabase configuration
│   │   ├── api.js                   # Database API functions
│   │   └── paystack.js              # Paystack configuration
│   │
│   ├── utils/
│   │   └── cryptoApi.js             # CoinGecko API integration
│   │
│   ├── assets/                      # Images and icons
│   ├── App.css
│   └── index.css                    # Global styles
│
├── index.html                       # SPA entry point
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
├── vercel.json                      # Vercel deployment configuration
├── eslint.config.js                 # ESLint rules
├── .npmrc                           # NPM configuration
└── supabase_schema.sql              # Database schema

**Total:** 56 JSX component files
```

---

## 🗄 Database Schema

Cheeseball uses **Supabase PostgreSQL** with Row Level Security (RLS) enabled on all tables. The database includes 6 main tables:

### 1. **profiles**

Extends Supabase's built-in `auth.users` table with additional user information.

```sql
- id: UUID (Primary Key, FK to auth.users)
- full_name: VARCHAR
- role: ENUM ('user', 'admin', 'super_admin')
- avatar_url: VARCHAR
- phone: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Purpose**: Store user profile information and roles.

### 2. **currencies**

Manages available cryptocurrencies on the platform.

```sql
- id: UUID (Primary Key)
- name: VARCHAR (e.g., 'Bitcoin')
- symbol: VARCHAR (e.g., 'BTC')
- price: DECIMAL (current market price in NGN)
- change_24h: DECIMAL (24-hour price change percentage)
- icon_url: VARCHAR (URL to crypto icon)
- color_class: VARCHAR (Tailwind color class for UI)
- is_active: BOOLEAN (whether trading is enabled)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Purpose**: Store cryptocurrency metadata and pricing. Managed by admins.

### 3. **transactions**

Tracks all user trading activities (buy, sell, swap).

```sql
- id: UUID (Primary Key)
- user_id: UUID (FK to profiles)
- type: ENUM ('buy', 'sell', 'swap')
- status: ENUM ('waiting', 'approved', 'canceled')
- from_amount: DECIMAL (amount user sends)
- from_currency_id: UUID (FK to currencies)
- from_token_network: VARCHAR (e.g., 'TRC-20', 'BTC')
- to_amount: DECIMAL (amount user receives)
- to_currency_id: UUID (FK to currencies)
- to_token_network: VARCHAR
- wallet_address: VARCHAR (user's crypto wallet)
- transaction_hash: VARCHAR (blockchain transaction ID)
- fee: DECIMAL (platform fee)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Purpose**: Maintain transaction history and order management.

### 4. **notifications**

System notifications sent to users and admins.

```sql
- id: UUID (Primary Key)
- title: VARCHAR
- heading: VARCHAR
- body: TEXT
- recipient_role: ENUM ('user', 'admin', 'all')
- is_read: BOOLEAN (default: false)
- created_at: TIMESTAMP
```

**Purpose**: Send targeted notifications based on user role.

### 5. **income_logs**

Tracks admin revenue and platform income.

```sql
- id: UUID (Primary Key)
- source: VARCHAR (source of income, e.g., 'transaction_fee')
- amount: DECIMAL (income amount)
- description: TEXT
- transaction_ref_id: UUID (FK to transactions)
- created_at: TIMESTAMP
```

**Purpose**: Monitor admin earnings and platform revenue.

### 6. **system_status**

Infrastructure and system health monitoring.

```sql
- id: UUID (Primary Key)
- name: VARCHAR (e.g., 'Database', 'API', 'Payment Gateway')
- status: ENUM ('Healthy', 'Down', 'Maintenance')
- updated_at: TIMESTAMP
```

**Purpose**: Track system component health status.

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account (free tier available at https://supabase.com)
- Paystack account (for payment processing at https://paystack.com)
- CoinGecko API access (free, no account needed)

### Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd cheeseball
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://bkqcnozcoeqnlsyqgzee.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anonymous-key>

# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=<your-paystack-public-key>

# CoinGecko API (no key needed, free API)
# Uses default: https://api.coingecko.com/api/v3
```

4. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

5. **Build for production**

```bash
npm run build
```

6. **Preview production build**

```bash
npm run preview
```

---

## 🚀 How It Works

### Application Flow

#### **User Journey**

1. **Landing Page** (`/`)
   - New users arrive at a marketing landing page
   - Options to sign up or log in

2. **Authentication** (`/auth` or `/signup`)
   - Users enter phone number or email
   - Receive OTP via Supabase magic link
   - Authentication handled through Supabase Auth

3. **Onboarding** (`/onboarding`, `/welcome`)
   - New users guided through platform features
   - Explain buy, sell, and swap functionality

4. **Main Dashboard** (`/currency-change`)
   - View available cryptocurrencies with real-time prices
   - Access buy, sell, or swap operations
   - View transaction history

5. **Trading Operations**
   - **Buy**: `/buy-crypto` → User selects amount → Confirm transaction → Paystack payment
   - **Sell**: `/sell-crypto` → User selects crypto amount → Bank transfer confirmation
   - **Swap**: `/seamless-crypto` → Exchange between two cryptocurrencies

6. **Transaction Confirmation**
   - Transaction moves through states: `waiting` → `approved`
   - User receives confirmation and receipt

#### **Admin Journey**

1. **Admin Login** (`/admin-login`)
   - Admin enters credentials
   - Accesses admin dashboard

2. **Admin Dashboard** (`/admin-dashboard`)
   - View platform statistics and metrics
   - Navigate to different management sections

3. **Currency Management**
   - Add new cryptocurrencies
   - Set/update prices
   - Activate/deactivate coins
   - Manage color and icon properties

4. **Order Management**
   - View all user transactions
   - Filter by status (`waiting`, `approved`, `canceled`)
   - Update transaction status

5. **Analytics & Reporting**
   - View income logs
   - Track transaction history
   - Monitor admin activity

### Core Processes

#### **Real-Time Price Updates**

```javascript
// From src/utils/cryptoApi.js
// Fetches top 50 cryptocurrencies from CoinGecko
// Updates every 60 seconds in production
const response = await fetch(
  "https://api.coingecko.com/api/v3/coins/markets?...",
);
const data = response.json();
// Stores in Supabase currencies table
```

#### **Transaction Processing**

1. User initiates transaction (buy/sell/swap)
2. System calculates exchange amounts using current rates
3. Transaction record created with status `waiting`
4. Payment processed (Paystack for fiat)
5. Admin notified of pending transaction
6. Admin approves/rejects transaction
7. Transaction status updated to `approved` or `canceled`

#### **Portfolio Calculation**

```javascript
// From src/lib/api.js - calculatePortfolio()
// Tracks user holdings across all currencies
// Sums all completed approved transactions
// Returns total portfolio value
```

---

## 📱 Key Features

### User-Side Features

**1. Authentication & Accounts**

- OTP-based secure authentication
- Magic link login/signup via email/phone
- Session management
- Auto-logout on timeout

**2. Trading Operations**

| Feature                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| **Buy Crypto**         | Purchase crypto using Nigerian Naira via Paystack    |
| **Sell Crypto**        | Convert crypto holdings back to fiat (bank transfer) |
| **Swap**               | Exchange one cryptocurrency for another              |
| **Portfolio Tracking** | View total holdings and asset allocation             |

**3. Market Data**

- Real-time cryptocurrency prices from CoinGecko
- 24-hour price change indicators
- Top 50 cryptocurrencies available
- Live rate calculations

**4. Transaction Management**

- Full transaction history
- Status tracking (waiting, approved, canceled)
- Receipt generation
- Support for multiple blockchain networks (TRC-20, BTC, etc.)

**5. Payment & Wallet**

- Paystack payment integration for buy operations
- Bank transfer details for sell operations
- Wallet address management
- Transaction hash verification

### Admin-Side Features

**1. Dashboard Overview**

- Total orders count
- Total trading volume
- Active currencies
- System health status

**2. Currency Management**

- Add/edit/delete cryptocurrencies
- Set market prices
- Configure color and icon properties
- Activate/deactivate currencies
- Bulk import from CoinGecko

**3. Order Management**

- View all transactions system-wide
- Filter by status and transaction type
- Update order status
- View detailed order information
- Download transaction reports

**4. Admin Account Management**

- View admin account details
- Manage account restrictions
- Set support contact information
- Configure notification preferences

**5. Analytics & Income Tracking**

- View income logs and revenue
- Track transaction fees collected
- Monitor transaction history
- Generate admin activity reports

---

## 🔌 API Integration

### Supabase Integration (`src/lib/supabaseClient.js`)

**Configuration:**

```javascript
const supabaseUrl = "https://bkqcnozcoeqnlsyqgzee.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Key Functions** (from `src/lib/api.js`):

| Function                    | Purpose                            |
| --------------------------- | ---------------------------------- |
| `getProfile()`              | Fetch user profile data            |
| `updateProfile()`           | Update user information            |
| `getCurrencies()`           | Get all available cryptocurrencies |
| `addCurrency()`             | Admin: Add new cryptocurrency      |
| `updateCurrency()`          | Admin: Modify crypto properties    |
| `deleteCurrency()`          | Admin: Remove cryptocurrency       |
| `createTransaction()`       | Create buy/sell/swap transaction   |
| `getTransactions()`         | Fetch user transaction history     |
| `getAllTransactions()`      | Admin: Get all system transactions |
| `updateTransactionStatus()` | Update transaction status          |
| `calculatePortfolio()`      | Calculate user's total holdings    |
| `getNotifications()`        | Retrieve user notifications        |
| `sendNotification()`        | Admin: Send notifications to users |

### CoinGecko API (`src/utils/cryptoApi.js`)

**Purpose**: Fetch real-time cryptocurrency market data.

```javascript
// Function: fetchCryptoData()
// Endpoint: https://api.coingecko.com/api/v3/coins/markets
// Returns: Top 50 cryptocurrencies with:
// - Current price in multiple currencies
// - 24h price change
// - Market cap
// - Volume
// - Icon URLs
```

**Features:**

- No API key required (free tier)
- Auto-updating prices every 60 seconds
- Supports multiple fiat currencies
- Historical data available

### Paystack Integration (`src/lib/paystack.js`)

**Configuration:**

```javascript
const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
```

**Usage** (in buy flow components):

- Initialize payment modal with transaction amount
- User completes payment through Paystack
- Webhook receives payment confirmation
- Transaction status updated to `approved`

**Payment Flow:**

1. User initiates buy transaction
2. System calculates total amount (crypto amount + fees)
3. Paystack modal opens with amount
4. User completes payment
5. Paystack sends success callback
6. Transaction approved in database

---

## 🔐 Authentication System

### How Authentication Works

1. **Entry Point**: User navigates to `/auth` or `/signup`

2. **OTP Generation**:
   - User enters phone number or email
   - Supabase sends magic link with OTP
   - User receives link via email/SMS

3. **Token Exchange**:
   - User clicks link or enters OTP
   - Supabase validates and creates session
   - JWT token stored in browser storage

4. **Session Management** (in `App.jsx`):

   ```javascript
   // App monitors auth state
   useEffect(() => {
     supabase.auth.onAuthStateChange((event, session) => {
       // Update user context on login/logout
       // Redirect accordingly
     });
   }, []);
   ```

5. **Protected Routes**:
   - Authenticated pages check for valid session
   - Auto-redirect to login if session invalid
   - Transaction pages require authenticated user

### Security Features

- **Supabase Row Level Security (RLS)**:
  - Users can only access their own data
  - Admins can access admin-specific data
  - Database enforces permissions

- **Magic Link Authentication**:
  - No password storage
  - One-time use tokens
  - Expiring links (default: 24 hours)

- **Environment Variables**:
  - API keys stored in `.env.local`
  - Not committed to version control
  - Anonymous key for client-side access

---

## 💳 Payment Processing

### Paystack Integration Flow

**1. Payment Initiation**

When a user initiates a buy transaction:

```javascript
// Component: BuyCryptocurrency.jsx
const handlePayment = async () => {
  // Calculate total with fees
  const totalAmount = cryptoAmount * currentPrice + platformFee;

  // Initialize Paystack with transaction details
  handler.openIframe({
    amount: totalAmount * 100, // Convert to kobo
    email: user.email,
    reference: transactionId,
    onClose: () => {
      /* handle cancellation */
    },
    onSuccess: handlePaymentSuccess,
  });
};
```

**2. Payment Processing**

- Paystack payment gateway handles card/account verification
- Real-time payment confirmation
- Automatic success/failure responses

**3. Transaction Confirmation**

On successful payment:

- Transaction status changes from `waiting` to `approved`
- User receives transaction receipt
- Crypto is transferred to user's wallet
- Admin notification generated

### Transaction Fee Model

```
Buy Transaction:
  Cryptocurrency Cost (calculated from CoinGecko price)
  + Platform Fee (usually 1-3%)
  = Total Amount to Charge

Sell Transaction:
  Crypto Amount * Current Price
  - Platform Fee
  = Amount User Receives
```

---

## 👨‍💼 Admin Dashboard

### Dashboard Navigation

The admin dashboard (`/admin-dashboard`) uses a bottom navigation bar with 5 main sections:

**1. Dashboard Home** (`AdminDashboardHome.jsx`)

```
Displays:
- Total orders count
- Total trading volume
- Active coins count
- System status indicators
- Recent transactions widget
```

**2. Currencies** (`AdminCurrencies.jsx`)

```
Features:
- List all cryptocurrencies
- Add new currency (modal)
- Edit currency properties (price, icon, color)
- Activate/deactivate coins
- Delete currencies
- Toggle favorite status
```

**3. Orders** (`AdminOrders.jsx`)

```
Features:
- View all system transactions
- Filter by status (waiting, approved, canceled)
- Filter by transaction type (buy, sell, swap)
- View detailed order information
- Update order status
- View user wallet addresses
```

**4. History** (`AdminHistory.jsx`)

```
Features:
- View all completed transactions
- Timeline view of activities
- Income logs from all transactions
- Export transaction history
```

**5. Account** (`AdminAccount.jsx`)

```
Features:
- Admin profile management
- View authorized admins
- Adjust admin permissions
- Account settings
- Notification preferences
```

---

## 🛣️ Routing & Navigation

### Route Structure

All routes are defined in `src/Routee.jsx`:

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<LandingPage />} />

  {/* Onboarding Routes */}
  <Route path="/onboarding" element={<Onboarding />} />
  <Route path="/welcome" element={<Welcome />} />

  {/* Feature Introduction Routes */}
  <Route path="/buy-crypto" element={<BuyCrypto />} />
  <Route path="/sell-crypto" element={<SellCrypto />} />
  <Route path="/seamless-crypto" element={<SeamCrypto />} />

  {/* Core Trading Routes */}
  <Route path="/currency-change" element={<CurrencyPage />} />

  {/* Authentication Routes */}
  <Route path="/auth" element={<Auth />} />
  <Route path="/signup" element={<Signup />} />

  {/* Admin Routes */}
  <Route path="/admin-login" element={<CheeseBallLogin />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
</Routes>
```

### Route Categories

| Category   | Routes                                                                | Purpose                           |
| ---------- | --------------------------------------------------------------------- | --------------------------------- |
| **Public** | `/`, `/onboarding`, `/welcome`                                        | Accessible without authentication |
| **Auth**   | `/auth`, `/signup`                                                    | User login and registration       |
| **User**   | `/buy-crypto`, `/sell-crypto`, `/seamless-crypto`, `/currency-change` | Main user features                |
| **Admin**  | `/admin-login`, `/admin-dashboard`                                    | Admin-only pages                  |

### Navigation Flow

```
Landing Page (/)
    ↓
Auth (/auth or /signup)
    ↓
Onboarding (/onboarding)
    ↓
Welcome (/welcome)
    ↓
Main Dashboard (/currency-change)
    └── Buy (/buy-crypto)
    └── Sell (/sell-crypto)
    └── Swap (/seamless-crypto)
```

---

## 🚀 Deployment

### Build & Preview

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Linting
npm run lint
```

### Deployment to Vercel

The project is configured for Vercel deployment with SPA (Single Page Application) support.

**Configuration** (`vercel.json`):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes are served through the React Router, enabling proper SPA navigation.

### Deployment Steps

1. **Connect repository to Vercel**
   - Go to https://vercel.com
   - Import project from GitHub/GitLab
   - Vercel auto-detects Vite configuration

2. **Set environment variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
   - Add `VITE_PAYSTACK_PUBLIC_KEY`

3. **Deploy**
   - Vercel automatically builds on push to main
   - Production URL displayed after deployment

4. **DNS Configuration**
   - Point custom domain to Vercel
   - Auto-generated SSL certificate

### Environment Variables

| Variable                   | Example                                    | Purpose                 |
| -------------------------- | ------------------------------------------ | ----------------------- |
| `VITE_SUPABASE_URL`        | `https://bkqcnozcoeqnlsyqgzee.supabase.co` | Backend database URL    |
| `VITE_SUPABASE_ANON_KEY`   | `long-key-string`                          | Supabase authentication |
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_live_xxxxx`                            | Payment processing      |

---

## 📊 Code Quality & Standards

### ESLint Configuration

The project uses ESLint for code quality. Rules are defined in `eslint.config.js`.

Run linting:

```bash
npm run lint
```

### Git Repository

**Recent commits:**

- `aa445e2` - fix it
- `9a8e098` - fix the error
- `16025e7` - Implement cryptocurrency exchange and purchase flow
- `48c9af1` - Add admin currency management with data synchronization
- `86c768e` - Configure Vercel rewrites for SPA routing

---

## 🔧 Common Development Tasks

### Adding a New Cryptocurrency

1. Admin navigates to Currencies page
2. Click "Add Currency" button
3. Fill in form:
   - Name (e.g., "Ethereum")
   - Symbol (e.g., "ETH")
   - Price (in NGN)
   - Icon URL
   - Color class (Tailwind color)
4. Submit form → API call → Database update
5. Currency appears in user's exchange list

### Processing User Transactions

1. User initiates buy/sell/swap
2. Transaction created with `waiting` status
3. Payment processed (for buy)
4. Admin notification sent
5. Admin navigates to Orders
6. Reviews transaction details
7. Updates status to `approved` or `canceled`
8. User receives notification

### Updating Cryptocurrency Prices

1. CoinGecko API fetches real-time data
2. Admin dashboard periodically syncs prices
3. Users see updated rates in real-time
4. Exchange calculations use latest prices

---

## 📞 Support & Contribution

For issues or questions:

- Check existing GitHub issues
- Review project documentation
- Contact development team

---

## 📝 License

[Add your license information here]

---

## 📋 Version Information

- **Version**: 0.0.0
- **Last Updated**: Feb 15, 2026
- **Node.js Required**: v18+
- **Package Manager**: npm

---

**Cheeseball** - Making cryptocurrency trading simple for Nigerians.
