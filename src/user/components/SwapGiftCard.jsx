import React, { useState, useEffect } from "react";
import { ArrowLeft, Gift } from "lucide-react";

const SwapGiftCard = ({ onBack, onSwap, onNavigate }) => {
  const [selectedCard, setSelectedCard] = useState("");
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

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
       setReceiveAmount((parseFloat(val) * card.rate).toLocaleString());
    } else {
       setReceiveAmount("");
    }
  };

  // Re-calculate when card changes
  useEffect(() => {
    handleAmountChange(amount);
  }, [selectedCard, amount]); // Added amount to dependency array to ensure re-calculation when amount changes too

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 uppercase text-[10px] font-black tracking-widest leading-none">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Swap Gift Card</h1>
              <p className="text-blue-200 font-medium">Turn your gift cards into instant cash</p>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => onNavigate('swap')}
                 className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest transition-all"
               >
                 Crypto
               </button>
               <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                 Gift Card
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
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
                rate: card?.rate
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
