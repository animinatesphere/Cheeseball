import React, { useState, useEffect } from "react";
import { Plus, ChevronLeft, SendHorizontal, Loader2 } from "lucide-react";
import { getNotifications } from "../../../lib/api";

const AdminNotifications = ({ notifications: propNotifications, onBack, onAdd }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data } = await getNotifications();
      if (data) {
        const mappedNotifications = data.map(n => ({
          id: n.id,
          title: n.title,
          heading: n.heading,
          body: n.body,
          date: new Date(n.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
          isRead: n.is_read
        }));
        setNotifications(mappedNotifications);
      }
      setLoading(false);
    };

    fetchNotifications();
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
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Postmaster</h1>
          </div>
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest px-1">Broadcast Alert</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-50 hover:shadow-2xl hover:border-blue-100 transition-all group ${!notification.isRead ? 'border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>}
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                     {notification.title}
                   </span>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notification.date}</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{notification.heading}</h3>
              <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">{notification.body}</p>
              
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                 <button className="bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center gap-2">
                   <SendHorizontal className="w-4 h-4" />
                   Retransmit Data
                 </button>
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <Plus className="w-5 h-5 rotate-45" />
                 </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
             <div className="text-center py-12 text-gray-400 font-bold">
                No system alerts found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
