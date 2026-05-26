# Buy Crypto Flow — Frontend Integration Guide

This guide outlines the step-by-step process for implementing the "Buy Crypto" flow. The backend has been updated to **fully automate** crypto delivery for Paystack and NGN Wallet payments.

> **Base URL**: `{YOUR_API_BASE}/api`
>
> All authenticated endpoints require a **JWT Bearer token** in the `Authorization` header.

---

## 🚀 The Big Picture

The flow consists of three main phases:
1. **Get a Quote**: Find out how much crypto the user gets for their Naira.
2. **Create Transaction**: Lock in the quote and choose a payment method.
3. **Pay & Deliver**: Execute the payment. If using Paystack or NGN Wallet, the backend will now instantly and automatically deliver the crypto to the user's internal wallet.

---

## Step 1: Get a Rate Quote
When the user types an amount in Naira and selects a crypto asset, fetch a live quote.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/rates/buy-quote` |
| **Auth** | ❌ None required |

**Request Body:**
```json
{
  "asset": "BTC",
  "naira_amount": 50000
}
```

**Response (`200 OK`):**
```json
{
  "id": 123,
  "asset_code": "BTC",
  "asset_name": "Bitcoin",
  "quote_type": "buy",
  "final_rate": "150000000.00",
  "crypto_amount": "0.00033333",
  "expires_at": "2026-05-24T21:45:00Z"
}
```
*Frontend Action: Display `crypto_amount` to the user and keep track of the `id`.*

---

## Step 2: Create the Buy Transaction
Once the user confirms they want to proceed, create the transaction. 

> [!TIP]
> **New Update:** `wallet_address` is now completely optional! The purchased crypto is automatically deposited into the user's internal CheeseBall wallet.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/broker/buy` |
| **Auth** | ✅ JWT Required |

**Request Body:**
```json
{
  "quote_id": 123,
  "payment_method": "paystack" 
}
```
*(Valid payment methods: `"paystack"`, `"ngn_wallet"`, `"bank_transfer"`)*

**Response (`200 OK`):**
```json
{
  "id": "abc-123-uuid",
  "status": "pending_payment",
  "transaction_type": "buy",
  "asset_code": "BTC",
  "naira_amount": "50000.00",
  "crypto_amount": "0.00033333"
}
```

> [!IMPORTANT]
> If `payment_method` is `"ngn_wallet"`, the transaction is instantly paid, and the backend auto-completes it. The status returned might already be `completed`, and the crypto is already in their wallet. You can skip Step 3 and go straight to the Success screen.

---

## Step 3: Setup Payment (For Paystack & Bank Transfer)
If the user isn't paying with their internal NGN Wallet, you need to initiate the payment process.

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/payments/setup` |
| **Auth** | ✅ JWT Required |

**Request Body:**
```json
{
  "transaction_id": "abc-123-uuid",
  "payment_method": "paystack"
}
```

### Path A: Paystack 
**Response (`200 OK`):**
```json
{
  "status": "pending",
  "provider_payload": {
    "status": true,
    "message": "Charge attempted",
    "data": {
      "reference": "cb-xyz123...",
      "display_text": "Transfer NGN 50,000 to Wema Bank...",
      "account_number": "0123456789",
      "bank": "Wema Bank"
    }
  }
}
```
*Frontend Action: Display the Paystack virtual account details (`account_number`, `bank`) so the user can make the transfer. The backend webhook will automatically detect the payment and instantly deliver the crypto to their wallet.*

### Path B: Manual Bank Transfer
*Frontend Action: Call `GET /api/payments/instructions` to get the company bank details and display them to the user.*

After the user transfers the money manually, they must upload/submit proof:

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/payments/transactions/{transaction_id}/bank-transfer/submit` |
| **Auth** | ✅ JWT Required |

**Request Body:**
```json
{
  "receipt_reference": "ref-from-receipt-123",
  "receipt_url": "https://link.to/uploaded/receipt.jpg"
}
```
*This requires an admin to manually review and approve the purchase before crypto is delivered.*

---

## Step 4: Polling for Status
While the user is making the payment (or waiting for Paystack to confirm), poll the transaction status.

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/broker/transactions/{transaction_id}` |
| **Auth** | ✅ JWT Required |

**Status Lifecycle:**
- `pending_payment`: Awaiting user payment.
- `pending_review`: User submitted receipt (Manual Bank Transfer only). Waiting for admin.
- `processing`: Payment verified, crypto is being allocated.
- `completed`: **Success!** Crypto is now in the user's internal wallet. 
- `failed` / `rejected`: Payment or transaction failed.

*Frontend Action: Poll every 10-15 seconds. When status hits `completed`, show the Success screen (e.g. "Purchase Successful! 0.00033 BTC has been added to your wallet").*
