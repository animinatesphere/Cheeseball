import React, { useState } from "react";
import { ArrowLeft, Plus, CreditCard } from "lucide-react";

const CardManagement = ({ onBack }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [cards, setCards] = useState([
    { id: 1, last4: "4242", expiry: "12/26", type: "Visa" },
    { id: 2, last4: "5555", expiry: "08/25", type: "Mastercard" },
  ]);

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Card Management</h1>
          <p className="text-blue-200 font-medium">Securely manage your saved cards</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm relative">
          <div className="space-y-4 mb-8">
            {cards.map((card) => (
              <div key={card.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{card.type} •••• {card.last4}</h3>
                    <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                  </div>
                </div>
                <button className="text-red-500 font-bold hover:text-red-600 transition-all p-2 bg-red-50 rounded-lg">Remove</button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
          >
            <Plus className="w-6 h-6" />
            <span>Add New Card</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative animate-bounce-in">
              <h2 className="text-2xl font-black mb-6 tracking-tight">Add New Card</h2>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 px-1">Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-2xl outline-none font-bold" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 px-1">Expiry</label>
                       <input type="text" placeholder="MM/YY" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-2xl outline-none font-bold" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 px-1">CVV</label>
                       <input type="text" placeholder="***" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-2xl outline-none font-bold" />
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100">Save Card</button>
                 <button onClick={() => setShowAddModal(false)} className="w-full text-gray-400 font-bold">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CardManagement;
