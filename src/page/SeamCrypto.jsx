import React from "react";
import logo from "../assets/CHEESEBALL 1.png";
import un from "../assets/undraw_credit-card-payment_3zqz 1.png";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SeamCrypto = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/sell-crypto");
  };
  const handleClick2 = () => {
    navigate("/currency-change");
  };
  return (
    <>
      {/* container */}
      <div className="min-h-screen flex flex-col bg-white page-container slide-in">
        <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 px-4 sm:px-6">
          <div className="flex justify-end py-4 sm:py-6">
            <p
              className="text-[#0063BF] text-base sm:text-lg font-bold cursor-pointer hover:bg-blue-50 px-4 py-2 rounded-full transition-all"
              onClick={handleClick2}
            >
              Skip
            </p>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 sm:gap-12 pb-8 sm:pb-12">
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 w-full">
              <img src={logo} alt="Cheeseball Logo" className="w-full max-w-[200px] sm:max-w-[280px] mb-6 sm:mb-8" />
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4 sm:mb-6 op tracking-tight">
                Seamless Crypto Swaps
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-8 sm:mb-10 max-w-md font-medium op leading-relaxed">
                Effortlessly exchange one cryptocurrency for another within our app.
                No need for multiple transactions. Simply select the coins you want to
                swap, and confirm.
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex gap-2">
                  <Link to="/buy-crypto" className="w-2.5 sm:w-3 h-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-all"></Link>
                  <div onClick={handleClick} className="w-2.5 sm:w-3 h-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-all"></div>
                  <div className="w-10 sm:w-12 h-2 bg-[#0063BF] rounded-full"></div>
                </div>
                <button 
                  onClick={handleClick2}
                  className="bg-[#0063BF] hover:bg-blue-700 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 transition-all hover:translate-x-1"
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center order-1 lg:order-2 w-full">
              <div className="relative group w-full max-w-[320px] sm:max-w-[550px]">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-[60px] sm:blur-[100px] opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img src={un} alt="Swap Crypto Illustration" className="relative w-full drop-shadow-2xl transition-transform group-hover:scale-105 duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end of container */}
    </>
  );
};

export default SeamCrypto;
