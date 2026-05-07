import { ArrowLeft, Gift, Clock, Sparkles } from "lucide-react";

const SwapGiftCard = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen animate-fade-in pb-24" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ background: 'var(--bg-secondary)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <button onClick={onBack} className="mb-6 p-3 rounded-2xl transition-all hover:bg-slate-50" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl sm:text-4xl sora font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>Swap Gift Card</h1>
              <p className="text-blue-400 font-bold text-sm tracking-wide">Turn your gift cards into instant cash</p>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => onNavigate('swap')}
                 className="bg-transparent hover:bg-slate-100 text-slate-500 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-xs uppercase tracking-widest font-black transition-all"
               >
                 Crypto
               </button>
               <button className="bg-blue-600 text-white shadow-lg shadow-blue-500/30 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-xs uppercase tracking-widest font-black transition-all">
                 Gift Card
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-20 relative overflow-hidden flex flex-col items-center text-center border border-slate-100 shadow-2xl shadow-slate-200/50">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

           <div className="relative z-10 w-28 h-28 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-amber-100/50 border border-amber-200/50 rotate-3 group-hover:rotate-6 transition-transform">
              <Gift className="w-14 h-14" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                 <Clock className="w-4 h-4 text-amber-600" />
              </div>
           </div>
           
           <h2 className="sora text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Coming Soon</h2>
           
           <p className="text-slate-500 text-sm sm:text-base font-bold leading-relaxed max-w-md mx-auto mb-10">
              We're currently building the fastest, most reliable gift card trading experience. Premium institutional rates and instant automated processing will be available shortly.
           </p>
           
           <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button onClick={onBack} className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-3xl font-black text-sm transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                 Return to Dashboard
              </button>
           </div>

           <div className="mt-12 flex items-center justify-center gap-2 relative z-10">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Cheeseball Exclusive Features</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SwapGiftCard;
