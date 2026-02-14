import React, { useState } from "react";
import { Clock, Loader2, CreditCard } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { createTransaction } from "../../lib/api";
import { usePaystackPayment } from "react-paystack";
import { PAYSTACK_PUBLIC_KEY } from "../../lib/paystack";

const CompleteOrderPage = ({ onBack, onBuyWithBankTransfer, transactionData, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank"); // 'bank' or 'card'
  const [userEmail, setUserEmail] = useState("user@example.com");

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    fetchUser();
  }, []);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: userEmail,
    amount: Math.round(Number(transactionData?.fromAmount || 0) * 100), // Paystack expects amount in kobo/cents
    publicKey: PAYSTACK_PUBLIC_KEY,
  };

  const onSuccess = (reference) => {
    handleTransactionSuccess(reference);
  };

  const onClose = () => {
    setLoading(false);
  };

  const initializePayment = usePaystackPayment(config);

  const handleTransactionSuccess = async (reference) => {
    if (!transactionData) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const exchangeId = `ID:${Math.random().toString(36).substring(2, 10)}`;

      const payload = {
        user_id: session.user.id,
        exchange_id: exchangeId,
        type: transactionData.type || 'buy',
        status: 'approved', // Automatically approve if payment is successful
        from_amount: transactionData.fromAmount,
        from_currency_id: transactionData.fromCurrencyId,
        from_token_network: transactionData.fromCurrency, 
        to_amount: transactionData.toAmount,
        to_currency_id: transactionData.toCurrencyId,
        to_token_network: transactionData.toCurrency,
        transaction_hash: reference.reference,
        wallet_address: transactionData.wallet_address,
        created_at: new Date().toISOString()
      };

      const { error } = await createTransaction(payload);
      
      if (error) {
        console.error("Error creating transaction:", error);
      } else {
        // Show success modal via CurrencyPage by navigating to rates and showing modal
        // For now, let's assume CurrencyPage handles "onContinue" to show success
        onBuyWithBankTransfer(); 
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (paymentMethod === "card") {
      setLoading(true);
      initializePayment(onSuccess, onClose);
    } else {
      handleBuy();
    }
  };

  const handleBuy = async () => {
    if (!transactionData) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const exchangeId = `ID:${Math.random().toString(36).substring(2, 10)}`;

      const payload = {
        user_id: session.user.id,
        exchange_id: exchangeId,
        type: transactionData.type || 'buy',
        status: 'waiting',
        from_amount: transactionData.fromAmount,
        from_currency_id: transactionData.fromCurrencyId,
        from_token_network: transactionData.fromCurrency, 
        to_amount: transactionData.toAmount,
        to_currency_id: transactionData.toCurrencyId,
        to_token_network: transactionData.toCurrency,
        wallet_address: transactionData.wallet_address,
        created_at: new Date().toISOString()
      };

      const { error } = await createTransaction(payload);
      
      if (error) {
        console.error("Error creating transaction:", error);
      } else {
        onBuyWithBankTransfer();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!transactionData) return null;

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <button onClick={onBack} className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all border border-white/10 font-black uppercase text-[10px] sm:text-xs tracking-widest leading-none">
              Close Order
            </button>
            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 border border-white/10 backdrop-blur-md">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>
              <span className="font-black text-[10px] sm:text-sm uppercase tracking-widest whitespace-nowrap">{transactionData.fromCurrency} • Global</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 tracking-tight">Order Confirmation</h1>
          <p className="text-blue-200 text-sm sm:text-base font-medium">Verify your selection before proceeding</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100">
               <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-4 sm:mb-6 block px-1">Payment Method</label>
               <div className="grid grid-cols-1 gap-4">
                  <label 
                    onClick={() => setPaymentMethod("bank")}
                    className={`flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] cursor-pointer border-2 transition-all ${paymentMethod === 'bank' ? 'border-blue-600 bg-white shadow-xl shadow-blue-50' : 'border-transparent bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-blue-600' : 'border-gray-300'}`}>
                        {paymentMethod === 'bank' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      <span className={`font-black text-lg sm:text-xl ${paymentMethod === 'bank' ? 'text-blue-600' : 'text-gray-400'}`}>Bank Transfer</span>
                    </div>
                    <div className="text-2xl sm:text-3xl">🏦</div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] cursor-pointer border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-white shadow-xl shadow-blue-50' : 'border-transparent bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-600' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      <span className={`font-black text-lg sm:text-xl ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'}`}>Debit Card (Paystack)</span>
                    </div>
                    <div className="flex gap-2 sm:gap-4 scale-75 sm:scale-100">
                       <img className="h-3 sm:h-4" src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                       <img className="h-4 sm:h-6" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                    </div>
                  </label>
               </div>
            </div>
            
            <div className="p-6 sm:p-8 bg-blue-50 rounded-[2rem] sm:rounded-[2.5rem] border border-blue-100 flex items-center gap-4 sm:gap-6">
               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
               </div>
               <div>
                  <p className="text-blue-900 font-black text-base sm:text-lg leading-tight">Rate matches current market</p>
                  <p className="text-blue-600 font-bold text-xs sm:text-sm">Update in <span className="text-red-600 tabular-nums">5 seconds</span></p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-gray-100 shadow-2xl flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6 sm:mb-8">Purchase Summary</h2>
            
            <div className="space-y-6 flex-1">
               <div className="bg-gray-50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] text-center mb-6 sm:mb-8 border border-gray-100">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3 sm:mb-4">You are buying</p>
                  <p className="text-2xl sm:text-4xl font-black text-gray-900 mb-1 sm:mb-2 tabular-nums">{transactionData.toAmount} <span className="text-lg sm:text-xl text-gray-400">{transactionData.toCurrency}</span></p>
                  <p className="text-blue-600 font-black text-base sm:text-lg">{Number(transactionData.fromAmount).toLocaleString()} {transactionData.fromCurrency}</p>
               </div>

               <div className="space-y-3 sm:space-y-4 px-2 sm:px-4 text-sm sm:text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Exchange Rate</span>
                    <span className="font-black text-gray-900 tabular-nums text-xs sm:text-base">1 {transactionData.toCurrency} = ... {transactionData.fromCurrency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Service Fee</span>
                    <span className="font-black text-green-600 tabular-nums">0.00</span>
                  </div>
                  <div className="pt-4 sm:pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-900 font-black text-lg sm:text-xl">Total To Pay</span>
                    <span className="font-black text-2xl sm:text-3xl text-blue-600 tabular-nums">{Number(transactionData.fromAmount).toLocaleString()} {transactionData.fromCurrency}</span>
                  </div>
               </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full mt-8 sm:mt-12 bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Pay Now</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrderPage;
