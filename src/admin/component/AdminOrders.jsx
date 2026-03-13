import React, { useState, useEffect } from "react";
import { Menu, ChevronRight, LayoutGrid, Loader2, Calendar, Search, Filter } from "lucide-react";
import AdminOrderFilter from "./AdminOrderFilter";
import AdminOrderDetails from "./AdminOrderDetails";
import { getTransactions, updateTransactionStatus, getGiftCardTrades, updateGiftCardTradeStatus } from "../../lib/api";

const AdminOrders = () => {
  const [currentPage, setCurrentPage] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [orders, setOrders] = useState({ crypto: [], giftcard: [] });
  const [viewTab, setViewTab] = useState("crypto"); // "crypto" or "giftcard"
  const [loading, setLoading] = useState(true);
  const [fetchStatus, setFetchStatus] = useState({ tx: 'pending', gc: 'pending', txCount: 0, gcCount: 0 });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: transactions, error: txError } = await getTransactions();
      const { data: gcTrades, error: gcError } = await getGiftCardTrades();

      setFetchStatus({
        tx: txError ? (txError.message || 'Error') : 'Success',
        gc: gcError ? (gcError.message || 'Error') : 'Success',
        txCount: transactions?.length || 0,
        gcCount: gcTrades?.length || 0
      });

      if (txError) console.error("Transactions Fetch Error:", txError);
      if (gcError) console.error("Gift Card Fetch Error:", gcError);

      const cryptoOrdersRaw = transactions ? transactions.filter(t => t.type !== 'giftcard') : [];
      const leakedGiftCardOrders = transactions ? transactions.filter(t => t.type === 'giftcard') : [];

      const cryptoOrders = cryptoOrdersRaw.map(t => ({
        id: t.id,
        orderType: 'crypto',
        date: new Date(t.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' }),
        fromAmount: `${t.from_amount} ${t.from_currency?.symbol || ''}`,
        fromToken: t.from_token_network,
        toAmount: `${t.to_amount} ${t.to_currency?.symbol || ''}`,
        toToken: t.to_currency?.symbol,
        status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
        exchangeId: t.exchange_id,
        email: t.profiles?.email,
        fullName: t.profiles?.full_name,
        phone: t.profiles?.phone,
        address: t.wallet_address,
        transactionHash: t.transaction_hash,
        fee: t.fee,
        screenshotUrl: t.screenshot_url,
        paymentMethod: t.payment_method,
        network: t.to_token_network,
        transactionDate: new Date(t.created_at).toLocaleString(),
        bankName: t.bank_name,
        accountName: t.bank_account_name,
        accountNumber: t.bank_account_number,
        fromIcon: t.from_currency?.icon_url || t.from_currency?.symbol?.[0] || 'F',
        toIcon: t.to_currency?.icon_url || t.to_currency?.symbol?.[0] || 'T',
        createdAt: new Date(t.created_at)
      }));

      const giftCardOrders = [
        ...(gcTrades || []).map(t => ({
          id: t.id,
          orderType: 'giftcard',
          date: new Date(t.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' }),
          fromAmount: `${t.amount} USD`,
          fromToken: t.card_type,
          toAmount: `${t.fiat_amount} NGN`,
          toToken: 'NGN',
          status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
          exchangeId: `GC:${t.id.slice(0, 8)}`,
          email: t.profiles?.email,
          fullName: t.profiles?.full_name,
          phone: t.profiles?.phone,
          address: t.bank_account_number,
          fee: "0.00",
          screenshotUrl: t.screenshot_url,
          transactionDate: new Date(t.created_at).toLocaleString(),
          fromIcon: 'GC',
          toIcon: '₦',
          frontImageUrl: t.front_image_url,
          backImageUrl: t.back_image_url,
          bankName: t.bank_name,
          accountName: t.bank_account_name,
          accountNumber: t.bank_account_number,
          createdAt: new Date(t.created_at)
        })),
        ...leakedGiftCardOrders.map(t => ({
          id: t.id,
          orderType: 'giftcard',
          date: new Date(t.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' }),
          fromAmount: `${t.from_amount} USD`,
          fromToken: t.from_token_network || 'Gift Card',
          toAmount: `${t.to_amount} NGN`,
          toToken: 'NGN',
          status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
          exchangeId: t.exchange_id,
          email: t.profiles?.email,
          fullName: t.profiles?.full_name,
          phone: t.profiles?.phone,
          address: t.bank_account_number,
          fee: t.fee,
          screenshotUrl: t.screenshot_url,
          transactionDate: new Date(t.created_at).toLocaleString(),
          fromIcon: 'GC',
          toIcon: '₦',
          frontImageUrl: t.screenshot_url, 
          bankName: t.bank_name,
          accountName: t.bank_account_name,
          accountNumber: t.bank_account_number,
          createdAt: new Date(t.created_at)
        }))
      ];

      setOrders({
        crypto: cryptoOrders.sort((a, b) => b.createdAt - a.createdAt),
        giftcard: giftCardOrders.sort((a, b) => b.createdAt - a.createdAt)
      });
    } catch (err) {
      console.error("Order fetch fatal:", err);
    } finally {
      setLoading(false);
    }
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
    let error;
    if (selectedOrder.orderType === 'giftcard') {
      const res = await updateGiftCardTradeStatus(orderId, newStatus.toLowerCase());
      error = res.error;
    } else {
      const res = await updateTransactionStatus(orderId, newStatus.toLowerCase());
      error = res.error;
    }

    if (!error) {
      await fetchOrders();
      setCurrentPage("orders");
      setSelectedOrder(null);
    } else {
      console.error("Failed to update status:", error);
      alert("Failed to update status: " + (error.message || "Unknown error"));
      setLoading(false);
    }
  };

  const handleClearSession = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
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
      <div className="flex-1 flex items-center justify-center h-full" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-20 transition-all border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-primary)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 sm:py-10 gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>Orders</h1>
              <div className="flex bg-gray-100/50 dark:bg-gray-800/30 p-1 rounded-xl mt-4 w-fit">
                <button 
                  onClick={() => setViewTab("crypto")}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewTab === 'crypto' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Crypto
                </button>
                <button 
                  onClick={() => setViewTab("giftcard")}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewTab === 'giftcard' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Gift Cards
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilter(true)}
                className="btn-ghost p-4 rounded-2xl flex items-center gap-2 group"
              >
                <Filter className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Filter</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-3 rounded-2xl border border-blue-500/20">
                <Calendar className="w-5 h-5" />
                <span className="text-xs font-black tabular-nums">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Connectivity Alert */}
        {(fetchStatus.tx !== 'Success' || fetchStatus.gc !== 'Success') && (
          <div className="mb-10 p-6 rounded-[2rem] border-2 border-red-500/20 bg-red-500/5 backdrop-blur-sm animate-fade-in">
             <div className="flex items-start gap-4">
               <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-500/30">
                 <Activity className="w-6 h-6 animate-pulse" />
               </div>
               <div className="flex-1">
                 <h4 className="text-red-500 font-extrabold text-sm uppercase tracking-widest mb-1">Database Sync Error</h4>
                 <p className="text-red-500/70 text-xs font-medium mb-4">Your connection to the Supabase rest cache is currently being throttled or redirected (Status 406/401).</p>
                 <button 
                  onClick={handleClearSession}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  Repair Connection
                </button>
               </div>
             </div>
          </div>
        )}

        <div className="space-y-12">
          {(orders[viewTab] || []).length > 0 ? (
            (orders[viewTab] || []).map((order, index) => {
               const tabOrders = orders[viewTab] || [];
               const showDate = index === 0 || tabOrders[index - 1].date !== order.date;
               return (
                 <div key={order.id} className="space-y-6">
                   {showDate && (
                      <div className="flex items-center gap-6 px-2">
                         <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-blue-500" />
                           <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">{order.date}</span>
                         </div>
                         <div className="h-px bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent flex-1"></div>
                      </div>
                   )}

                   <div
                      onClick={() => handleOrderClick(order)}
                      className="card p-6 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-8 group animate-fade-in relative overflow-hidden"
                   >
                      <div className="absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-2" style={{ background: order.status === 'Completed' || order.status === 'Approved' ? 'var(--success)' : (order.status === 'Pending' || order.status === 'Waiting' ? 'var(--warning)' : 'var(--danger)') }}></div>
                      
                      <div className="flex-1 flex items-center gap-8">
                         <div className="flex items-center -space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl border-4 border-white dark:border-gray-800 relative z-10 overflow-hidden transform group-hover:-rotate-6 transition-transform">
                              {order.fromIcon?.length > 2 ? <img src={order.fromIcon} alt="" className="w-full h-full object-cover"/> : order.fromIcon}
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl border-4 border-white dark:border-gray-800 relative z-0 transform group-hover:translate-x-4 group-hover:rotate-6 transition-all overflow-hidden">
                              {order.toIcon?.length > 2 ? <img src={order.toIcon} alt="" className="w-full h-full object-cover"/> : order.toIcon}
                            </div>
                         </div>
                         
                         <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                               <p className="font-black text-2xl truncate group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{order.fromAmount}</p>
                               <span className="text-blue-500 font-bold">→</span>
                               <p className="font-black text-xl truncate" style={{ color: 'var(--text-secondary)' }}>{order.toAmount}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">#{order.exchangeId?.slice(-8)}</span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                               <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{order.fullName}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-10 sm:pl-10 sm:border-l border-gray-100 dark:border-gray-800">
                         <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network</p>
                            <p className="text-sm font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{order.toToken || 'NGN'}</p>
                         </div>
                         
                         <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                            order.status === "Waiting" || order.status === "Pending" 
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                            : (order.status === "Completed" || order.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20")
                         }`}>
                            {order.status}
                         </span>
                         
                         <div className="p-3 rounded-2xl bg-blue-500/5 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg group-hover:shadow-blue-500/20 group-hover:-translate-x-1">
                            <ChevronRight className="w-6 h-6" />
                         </div>
                      </div>
                   </div>
                 </div>
               );
            })
          ) : (
             <div className="text-center py-24 card border-dashed border-2">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>No {viewTab} results found</h3>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>We couldn't find any orders matching this category.</p>
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
