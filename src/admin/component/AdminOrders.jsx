import React, { useState, useEffect } from "react";
import { Menu, ChevronRight, LayoutGrid, Loader2 } from "lucide-react";
import AdminOrderFilter from "./AdminOrderFilter";
import AdminOrderDetails from "./AdminOrderDetails";
import { getTransactions, updateTransactionStatus } from "../../lib/api";

const AdminOrders = () => {
  const [currentPage, setCurrentPage] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await getTransactions();
    if (data) {
      // Map Supabase data to component format
      const mappedOrders = data.map(t => ({
        id: t.id,
        date: new Date(t.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' }),
        fromAmount: `${t.from_amount} ${t.from_currency?.symbol || ''}`,
        fromToken: t.from_token_network,
        toAmount: `${t.to_amount} ${t.to_currency?.symbol || ''}`,
        toToken: t.to_currency?.symbol,
        status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
        exchangeId: t.exchange_id, // Keep full ID for API, display partial
        email: t.profiles?.email,
        fullName: t.profiles?.full_name,
        phone: t.profiles?.phone,
        address: t.wallet_address,
        transactionHash: t.transaction_hash,
        fee: t.fee,
        network: t.to_token_network,
        transactionDate: new Date(t.created_at).toLocaleString(),
        // Helper for UI icons (mock logic for now, could be dynamic)
        fromIcon: t.from_currency?.symbol?.[0] || 'F',
        toIcon: t.to_currency?.symbol?.[0] || 'T',
      }));
      setOrders(mappedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setCurrentPage("details");
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setLoading(true);
    const { error } = await updateTransactionStatus(orderId, newStatus.toLowerCase());
    if (!error) {
      await fetchOrders();
      setCurrentPage("orders");
      setSelectedOrder(null);
    } else {
      console.error("Failed to update status:", error);
      setLoading(false);
    }
  };

  if (currentPage === "details" && selectedOrder) {
    return (
      <AdminOrderDetails 
        order={selectedOrder} 
        onBack={() => setCurrentPage("orders")} 
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
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
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-50 border-2 border-white relative z-10">{order.fromIcon}</div>
                          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-50 border-2 border-white relative z-0 group-hover:translate-x-4 transition-transform">{order.toIcon}</div>
                       </div>
                       <div>
                          <p className="font-black text-gray-900 text-lg sm:text-xl leading-tight">{order.fromAmount} <span className="text-blue-600">→</span> {order.toAmount}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: {order.exchangeId.split(':')[1] || order.exchangeId}</p>
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
          {orders.length === 0 && (
             <div className="text-center py-12 text-gray-400 font-bold">
                No orders found.
             </div>
          )}
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
