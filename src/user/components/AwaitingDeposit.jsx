import React, { useState, useEffect } from "react";
import { ArrowLeft, Share2, Copy } from "lucide-react";

const AwaitingDeposit = ({ onBack }) => {
  const depositAddress = "0x52d39886F8022764880Fff88DdE280F6C5D3CcD";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [qrSquares, setQrSquares] = useState(() =>
    Array.from({ length: 64 }, () => false)
  );

  useEffect(() => {
    const squares = Array.from({ length: 64 }, () => Math.random() > 0.5);
    const timer = setTimeout(() => setQrSquares(squares), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <button onClick={onBack} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Deposit Funds</h1>
          <p className="text-blue-200 font-medium">Finalize your swap by sending assets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transform group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">Swap Intent</p>
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                   <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center text-green-900 font-black text-xl shadow-lg">T</div>
                </div>
                <p className="text-5xl font-black mb-2 tabular-nums">5,000.00 <span className="text-xl text-blue-200">USDT</span></p>
                <p className="text-blue-100 font-bold uppercase tracking-widest text-sm">TRC-20 Network</p>
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
                  <span className="text-blue-300 text-xs font-bold">SWAP ID: Hhdf-u678-jdHD</span>
                  <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Status: Pending</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center border border-orange-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-sm font-bold text-gray-900">Only send <span className="text-orange-600">TRC-20</span> assets. Other networks will result in permanent loss.</p>
              </div>
              
              <div className="flex items-center justify-center gap-6">
                <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-orange-100">
                  ₿
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Expected Return</p>
                  <p className="font-black text-2xl text-gray-900 leading-none">0.002445 <span className="text-sm text-gray-400">BTC</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-xl flex flex-col items-center">
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest mb-8">Deposit Address</p>
            
            <div className="w-64 h-64 p-6 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex items-center justify-center mb-10 group hover:border-blue-400 transition-all">
              <div className="grid grid-cols-8 gap-1 p-2 w-full h-full bg-white rounded-2xl shadow-inner active:scale-95 transition-transform cursor-pointer">
                {qrSquares.map((on, i) => (
                  <div
                    key={i}
                    className={`w-full h-full rounded-sm ${on ? "bg-gray-900" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full relative group mb-12">
              <div className="bg-gray-50 px-8 py-6 rounded-[2rem] border-2 border-transparent group-hover:border-blue-100 transition-all">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">Wallet Address</p>
                <p className="font-mono text-sm font-bold text-gray-900 break-all leading-relaxed">
                  {depositAddress}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0063BF] text-white font-black px-8 py-4 rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center gap-2 group/btn"
              >
                <span>{copied ? "Copied" : "Copy"}</span>
                <Copy className={`w-4 h-4 ${copied ? "animate-bounce" : "group-hover/btn:translate-y-px"}`} />
              </button>
            </div>

            <button
              onClick={onBack}
              className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
            >
              <span>Verify & Complete</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AwaitingDeposit;
