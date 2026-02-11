import React from "react";
import logo from "../assets/CHEESEBALL 1.png";
import man from "../assets/undraw_multiple-choice_9n00 1.png";
import { Link, useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const handleSkip = () => {
    navigate("/welcome");
  };

  return (
    <>
      {/* parent */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50 page-container slide-in">
        <div className="flex justify-end w-full max-w-7xl mx-auto py-4">
          <button
            onClick={handleSkip}
            className="text-[#0063BF] font-extrabold px-6 py-2 hover:bg-blue-100 rounded-full transition-all"
          >
            Skip
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto w-full gap-12 px-4 pb-12">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <img src={logo} alt="Cheeseball Logo" className="w-full max-w-[300px] mb-8 lg:mb-12" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              BUY, SELL & <br className="hidden lg:block"/>
              <span className="text-[#0063BF]">SWAP CRYPTO</span>
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-md">
              The most secure and seamless way to manage your digital assets. 
              Join thousands of users trading on Cheeseball today.
            </p>
            <Link to="/welcome" className="w-full sm:w-auto">
              <button className="bg-[#0063BF] hover:bg-blue-700 text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 op">
                Get started
              </button>
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
              <img src={man} alt="Trading Illustration" className="relative w-full max-w-[500px] drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
      {/* end of parent */}
    </>
  );
};

export default Onboarding;
