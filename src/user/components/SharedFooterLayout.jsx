import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "../../assets/CHEESEBALL 1.png";

const SharedFooterLayout = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Cheeseball" className="h-10 w-auto" />
            <span className="font-black text-xl tracking-tight text-blue-900 hidden sm:block">
              CHEESEBALL
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            {title}
          </h1>
          <div className="h-2 w-20 bg-blue-600 rounded-full mt-6"></div>
        </div>
        
        <div className="prose prose-blue prose-xl max-w-none text-gray-600 font-medium leading-relaxed animate-fade-in-up delay-[100ms]">
          {children}
        </div>
      </main>

      {/* Basic Footer for these pages */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
            © 2024 CHEESEBALL • ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SharedFooterLayout;
