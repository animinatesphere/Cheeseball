import { ArrowLeft, Gift, Ticket, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { validatePromoCode } from "../../lib/api";

const SwapGiftCard = ({ onBack, onSwap, onNavigate }) => {
  const [selectedCard, setSelectedCard] = useState("");
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoBenefit, setPromoBenefit] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const giftCards = [
    { id: "amazon", name: "Amazon Card", rate: 1250 },
    { id: "itunes", name: "iTunes Card", rate: 1180 },
    { id: "steam", name: "Steam Card", rate: 1300 },
    { id: "google", name: "Google Play", rate: 1150 },
    { id: "sephora", name: "Sephora", rate: 1280 },
    { id: "nordstrom", name: "Nordstrom", rate: 1280 },
    { id: "razer", name: "Razer Gold", rate: 1220 },
  ];

  const handleAmountChange = (val) => {
    setAmount(val);
    const card = giftCards.find(c => c.id === selectedCard);
    if (val && card) {
       const baseAmount = parseFloat(val) * card.rate;
       const bonus = baseAmount * (promoBenefit / 100);
       setReceiveAmount((baseAmount + bonus).toLocaleString());
    } else {
       setReceiveAmount("");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoSuccess(false);
    
    const { data, error } = await validatePromoCode(promoCode);
    
    if (error || !data) {
      setPromoError(error?.message || "Invalid code");
      setPromoBenefit(0);
    } else {
      setPromoBenefit(data.benefit_percentage);
      setPromoSuccess(true);
    }
    setPromoLoading(false);
  };

  // Re-calculate when card changes
  useEffect(() => {
    handleAmountChange(amount);
  }, [selectedCard, amount, promoBenefit]);

  return (
    <div className="min-h-screen animate-fade-in pb-24" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ background: 'var(--bg-secondary)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <button onClick={onBack} className="mb-6 p-3 rounded-2xl transition-all" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>Swap Gift Card</h1>
              <p className="text-blue-400 font-medium text-sm">Turn your gift cards into instant cash</p>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => onNavigate('swap')}
                 className="btn-ghost px-4 sm:px-6 py-2 sm:py-3 text-xs uppercase tracking-widest"
               >
                 Crypto
               </button>
               <button className="btn-primary px-4 sm:px-6 py-2 sm:py-3 text-xs">
                 Gift Card
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="max-w-3xl mx-auto card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 relative overflow-hidden group">
          <div className="space-y-8 relative z-10">
            <div>
              <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block px-2">Gift Card Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {giftCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card.id)}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group/card ${
                      selectedCard === card.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl translate-y-[-4px]" 
                      : "bg-white border-transparent hover:border-blue-100 text-gray-900"
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${selectedCard === card.id ? "bg-white/10" : "bg-blue-50 text-blue-600"}`}>
                       <Gift className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-center line-clamp-1">{card.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="text-gray-400 font-black uppercase text-xs tracking-widest px-2 block">Amount (USD)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full px-8 py-6 bg-white rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all text-xl font-black text-gray-900"
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-gray-400 font-black uppercase text-xs tracking-widest px-2 block">You Get (NGN)</label>
                  <div className="w-full px-8 py-6 bg-white rounded-2xl border-2 border-transparent text-xl font-black text-blue-600 shadow-inner flex items-center justify-between">
                     <span>{receiveAmount || '0.00'}</span>
                     <span className="text-xs text-blue-300 font-black uppercase tracking-widest">NGN</span>
                  </div>
               </div>
            </div>

            {/* Promo Code Card */}
            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <label className="text-gray-400 font-black uppercase text-xs tracking-widest block">Promo Code</label>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-transparent focus-within:border-blue-100 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <Ticket size={20} />
                   </div>
                   <input
                     type="text"
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                     placeholder="ENTER CODE"
                     className="flex-1 bg-transparent text-lg font-black text-gray-900 placeholder-gray-200 outline-none uppercase tracking-widest"
                   />
                   <button 
                     onClick={handleApplyPromo}
                     disabled={promoLoading || !promoCode}
                     className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                   >
                     {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                   </button>
                </div>
                {promoError && <p className="mt-3 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><XCircle size={14} /> {promoError}</p>}
                {promoSuccess && <p className="mt-3 text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} /> Success! {promoBenefit}% boost applied</p>}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const card = giftCards.find(c => c.id === selectedCard);
              onSwap({
                type: 'giftcard',
                cardName: card?.name,
                fromAmount: amount,
                fromCurrency: 'USD',
                toCurrency: 'NGN',
                toAmount: receiveAmount.replace(/,/g, ''),
                rate: card?.rate,
                promoCode: promoSuccess ? promoCode : null,
                promoBenefit: promoSuccess ? promoBenefit : 0
              });
            }}
            disabled={!selectedCard || !amount}
            className="w-full mt-10 bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            <span>Preview Swap</span>
            <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapGiftCard;
