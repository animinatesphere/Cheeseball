import React from "react";
import { X, Copy, ChevronRight, MoreVertical } from "lucide-react";

const AdminOrderDetails = ({ order, onBack, onShowDetails, onUpdateStatus }) => {
  const isApproved = order.status === "Approved";
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-6 sm:py-8 border-b border-gray-100 mb-8 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
            <X className="w-6 h-6 text-gray-900" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Order Insight</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
              Exchange {order.exchangeId}
            </p>
          </div>
          <button className="p-3 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
            <MoreVertical className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-sm transition-all hover:bg-white hover:shadow-2xl group">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-5 w-full sm:w-auto">
                 <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-50 group-hover:scale-110 transition-transform">T</div>
                 <div>
                   <div className="font-black text-gray-900 text-xl leading-tight">{order.fromAmount}</div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">{order.fromToken}</div>
                 </div>
               </div>
               
               <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 rotate-90 sm:rotate-0">
                 <ChevronRight className="w-6 h-6 text-blue-600" />
               </div>

               <div className="flex items-center gap-5 w-full sm:w-auto sm:text-right">
                 <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-50 group-hover:scale-110 transition-transform order-last sm:order-first">₿</div>
                 <div className="order-first sm:order-last flex-1 sm:flex-none">
                    <div className="font-black text-gray-900 text-xl leading-tight">{order.toAmount}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">{order.toToken}</div>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-4">
             {[
               { label: "Execution Date", value: order.transactionDate },
               { label: "Operational Status", value: isApproved ? "Succeeded" : "Awaiting Verification", color: isApproved ? "text-green-600" : "text-orange-500" },
               { label: "Network Protocol", value: order.network },
               { label: "System Fee", value: order.fee, color: "text-red-500" }
             ].map((item, i) => (
               <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 hover:px-2 transition-all">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                 <span className={`font-black text-sm ${item.color || "text-gray-900"}`}>{item.value}</span>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest ml-2 mb-4">Personal Vault</h3>
              {[
                { label: "Identifier", value: order.email },
                { label: "Full Signature", value: order.fullName },
                { label: "Contact Point", value: order.phone }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-transparent hover:border-blue-100 transition-all">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">{item.label}</span>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-gray-900 truncate">{item.value}</span>
                    <button onClick={() => copyToClipboard(item.value)} className="text-blue-600 hover:scale-110 transition-transform">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
               <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest ml-2 mb-4">Operational Data</h3>
               <div className="bg-gray-50 rounded-2xl p-5 border border-transparent hover:border-blue-100 transition-all h-full">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 leading-none">Settlement Address (USDT)</span>
                  <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-100 break-all font-mono text-xs font-bold text-gray-900 leading-relaxed mb-6">
                    {order.address}
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.address)}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-50 active:scale-95 transition-all"
                  >
                    Copy Global Address
                  </button>
               </div>
            </div>
          </div>

          {order.status === "Waiting" ? (
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => onUpdateStatus(order.id, "Declined")}
                className="flex-1 bg-red-50 text-red-600 py-6 rounded-3xl font-black text-xl hover:bg-red-100 transition-all active:scale-[0.98]"
              >
                Decline
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, "Approved")}
                className="flex-1 bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all active:scale-[0.98]"
              >
                Approve Order
              </button>
            </div>
          ) : (
            <button
              onClick={onBack}
              className="w-full bg-gray-100 text-gray-500 py-6 rounded-3xl font-black text-xl hover:bg-gray-200 transition-all active:scale-[0.98] mt-8"
            >
              Close Details
            </button>
          )} 
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
