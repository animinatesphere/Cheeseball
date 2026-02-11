import React, { useState } from "react";
import { Menu, ChevronRight, LayoutGrid } from "lucide-react";
import AdminOrderFilter from "./AdminOrderFilter";
import AdminOrderDetails from "./AdminOrderDetails";

const AdminOrders = () => {
  const [currentPage, setCurrentPage] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const orders = [
    {
      id: 1,
      date: "02 July 2023",
      fromAmount: "5000 USDT",
      fromToken: "TRC-20",
      toAmount: "0.002445 BTC",
      toToken: "BTC",
      status: "Waiting",
      exchangeId: "ID:voec66skoivtqpmd",
      email: "Cheese Balls 05",
      fullName: "Cheese Balls 05",
      phone: "Loopay",
      address: "Tcndjh73j6fhe78ej87hwey73h",
      transactionHash: "243h7dyjf7e7jh89e...",
      fee: "-7.89",
      network: "TRC-20",
      transactionDate: "Feb 2, 2025 at 2:52 am",
    },
    {
      id: 2,
      date: "02 July 2023",
      fromAmount: "5000 USDT",
      fromToken: "TRC-20",
      toAmount: "0.002445 BTC",
      toToken: "BTC",
      status: "Approved",
      exchangeId: "ID:voec66skoivtqpmd",
      email: "Cheese Balls 05",
      fullName: "Cheese Balls 05",
      phone: "Loopay",
      address: "Tcndjh73j6fhe78ej87hwey73h",
      transactionHash: "243h7dyjf7e7jh89e...",
      fee: "-7.89",
      network: "TRC-20",
      transactionDate: "Feb 2, 2025 at 2:52 am",
    },
    {
      id: 3,
      date: "28 June 2023",
      fromAmount: "2500 USDT",
      fromToken: "TRC-20",
      toAmount: "0.0012BTC",
      toToken: "BTC",
      status: "Waiting",
      exchangeId: "ID:voec66skoivtqpmd",
      email: "Cheese Balls 05",
      fullName: "Cheese Balls 05",
      phone: "Loopay",
      address: "Tcndjh73j6fhe78ej87hwey73h",
      transactionHash: "243h7dyjf7e7jh89e...",
      fee: "-7.89",
      network: "TRC-20",
      transactionDate: "Feb 2, 2025 at 2:52 am",
    },
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setCurrentPage("details");
  };

  if (currentPage === "details" && selectedOrder) {
    return <AdminOrderDetails order={selectedOrder} onBack={() => setCurrentPage("orders")} />;
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Log</h1>
            <button
              onClick={() => setShowFilter(true)}
              className="bg-gray-50 p-3 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 border border-transparent hover:border-blue-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {orders.map((order, index) => {
             const showDate = index === 0 || orders[index - 1].date !== order.date;
             return (
               <div key={order.id} className="space-y-4">
                 {showDate && (
                    <div className="flex items-center gap-4 px-2">
                       <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{order.date}</span>
                       <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                 )}

                 <div
                    onClick={() => handleOrderClick(order)}
                    className="bg-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-8 hover:shadow-2xl hover:border-blue-100 border border-gray-50 transition-all cursor-pointer group animate-fade-in"
                 >
                    <div className="flex-1 flex items-center gap-6">
                       <div className="flex items-center -space-x-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-50 border-2 border-white relative z-10">T</div>
                          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-50 border-2 border-white relative z-0 group-hover:translate-x-4 transition-transform">₿</div>
                       </div>
                       <div>
                          <p className="font-black text-gray-900 text-lg sm:text-xl leading-tight">{order.fromAmount} <span className="text-blue-600">→</span> {order.toAmount}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: {order.exchangeId.split(':')[1]}</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-8 sm:border-l border-gray-50">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === "Waiting" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                       }`}>
                          {order.status}
                       </span>
                       <div className="bg-blue-50 p-2 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                          <ChevronRight className="w-5 h-5" />
                       </div>
                    </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      {showFilter && (
        <AdminOrderFilter
          onClose={() => setShowFilter(false)}
          onApply={(filters) => {
            console.log("Applying filters:", filters);
            setShowFilter(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminOrders;
