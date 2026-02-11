import React, { useState, useEffect } from "react";
import AdminAccountHeader from "./AdminAccountHeader";
import { getIncomeLogs } from "../../../lib/api";
import { Loader2 } from "lucide-react";

const AdminIncome = ({ onBack, onSelectTransaction }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      setLoading(true);
      const { data } = await getIncomeLogs();
      if (data) {
        const mappedLogs = data.map(log => ({
          id: log.id,
          name: log.source,
          amount: `₦${Number(log.amount).toLocaleString()}`,
          description: log.description
        }));
        setTransactions(mappedLogs);
      }
      setLoading(false);
    };

    fetchIncome();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <AdminAccountHeader title="Revenue Stream" onBack={onBack} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl shadow-blue-100 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transform group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-2">Aggregate Earnings</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-black text-blue-300">₦</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums">2,300,027.87</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-8 border-t border-white/10">
              <div className="text-blue-100 font-bold">
                Pending Settlement: <span className="text-white font-black ml-2 tabular-nums">₦ 2,859.87</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-widest ml-1">Live Feed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Influx</h2>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">This Month</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-3xl p-5 flex justify-between items-center shadow-sm border border-gray-50 hover:shadow-2xl hover:border-blue-100 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-lg shadow-blue-50/50 group-hover:scale-110 transition-transform">
                  C
                </div>
                <div>
                  <div className="font-black text-gray-900 text-lg leading-tight truncate max-w-[150px]">{transaction.name}</div>
                  <div className="text-blue-600 font-black text-sm mt-1 tabular-nums">
                    {transaction.amount}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onSelectTransaction(transaction)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                Inspect
              </button>
            </div>
          ))}
          {transactions.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-400 font-bold">
                No revenue logs recorded.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIncome;
