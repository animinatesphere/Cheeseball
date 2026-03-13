import React, { useState, useEffect } from "react";
import { Menu, ChevronRight, LayoutGrid, Loader2 } from "lucide-react";
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

    // Separate transactions into crypto and giftcard (in case any giftcards were saved to transactions table)
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
        frontImageUrl: t.screenshot_url, // Case where it might be in transactions table
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
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Log</h1>
              <div className="flex gap-4 mt-2">
                <button 
                  onClick={() => setViewTab("crypto")}
                  className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${viewTab === 'crypto' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
                >
                  Crypto
                </button>
                <button 
                  onClick={() => setViewTab("giftcard")}
                  className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${viewTab === 'giftcard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
                >
                  Gift Cards
                </button>
              </div>
            </div>
            
            {(fetchStatus.tx !== 'Success' || fetchStatus.gc !== 'Success') && (
              <div className="bg-red-50 p-4 rounded-2xl text-[10px] font-mono text-red-600 border-2 border-red-100 mb-6 max-w-md shadow-xl animate-bounce">
                <div className="font-black text-xs mb-2 uppercase tracking-widest">⚠️ Connectivity Error Detected</div>
                <div className="space-y-1 mb-4">
                  <div>TX: {fetchStatus.tx}</div>
                  <div>GC: {fetchStatus.gc}</div>
                </div>
                <button 
                  onClick={handleClearSession}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-200"
                >
                  Force Clear Session & Refresh
                </button>
                <p className="mt-2 text-[8px] opacity-70 italic">*Clicking this fixes 401 Unauthorized errors by refreshing your API key connection.</p>
              </div>
            )}
            
            <button
              onClick={() => setShowFilter(true)}
              className="bg-gray-50 p-3 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 border border-transparent hover:border-blue-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">        <div className="space-y-8">
          {(orders[viewTab] || []).map((order, index) => {
             const tabOrders = orders[viewTab] || [];
             const showDate = index === 0 || tabOrders[index - 1].date !== order.date;
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
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-50 border-2 border-white relative z-10 overflow-hidden">
                            {order.fromIcon?.length > 2 ? <img src={order.fromIcon} alt="" className="w-full h-full object-cover"/> : order.fromIcon}
                          </div>
                          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-50 border-2 border-white relative z-0 group-hover:translate-x-4 transition-transform overflow-hidden">
                            {order.toIcon?.length > 2 ? <img src={order.toIcon} alt="" className="w-full h-full object-cover"/> : order.toIcon}
                          </div>
                       </div>
                       <div>
                          <p className="font-black text-gray-900 text-lg sm:text-xl leading-tight">{order.fromAmount} <span className="text-blue-600">→</span> {order.toAmount}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            ID: {order.exchangeId ? (order.exchangeId.includes(':') ? order.exchangeId.split(':')[1] : order.exchangeId) : 'N/A'}
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-8 sm:border-l border-gray-50">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === "Waiting" || order.status === "Pending" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
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
          {(orders[viewTab] || []).length === 0 && (
             <div className="text-center py-12 text-gray-400 font-bold">
                No {viewTab} orders found.
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
