import React from "react";
import logo from "../assets/CHEESEBALL 1.png";
import { Link } from "react-router-dom";
const Welcome = () => {
  return (
    <>
      {/* container */}
      <div className="flex flex-col mt-8 page-container slide-in">
        <div>
          <img src={logo} alt="" className="max-w-[350px] mx-auto" />
        </div>

        <div>
          <p
            className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-center pt-40"
            text="BUY, SELL & SWAP CRYPTO op"
          >
            Log in as
          </p>
        </div>
        <Link to="/buy-crypto" className="flex items-center pt-30 mb-4">
          <button className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] bg-[#0063BF] w-full sm:w-[350px] h-[54px] text-white mx-auto rounded-3xl cursor-pointer hover:animate-pulse font-bold op mt-6 ">
            User
          </button>
        </Link>
        <Link className="flex items-center" to="/admin-login">
          <button className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] bg-[#E3EAF2] w-full sm:w-[350px] h-[54px] text-[#0063BF] mx-auto rounded-3xl font-bold op mt-3 cursor-pointer hover:animate-pulse">
            Admin
          </button>
        </Link>
      </div>
      {/* end of container */}
    </>
  );
};

export default Welcome;
