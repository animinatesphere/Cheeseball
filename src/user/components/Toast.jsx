import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react";

const Toast = ({ message, type = "info", duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out animation
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    loading: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-100",
    error: "bg-red-50 border-red-100",
    info: "bg-blue-50 border-blue-100",
    loading: "bg-gray-50 border-gray-100",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[100] transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${bgColors[type]} min-w-[320px] max-w-md`}
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1">
          <p className={`text-sm font-black ${type === 'error' ? 'text-red-900' : 'text-gray-900'}`}>
            {message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors text-gray-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
