import React from "react";
import logo from "../assets/CHEESEBALL 1.png";
import un from "../assets/undraw_mobile-pay_yho9 1.png";
import { Link, useNavigate } from "react-router-dom";

const SellCrypto = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/sell-crypto");
  };
  const handleClick2 = () => {
    navigate("/seamless-crypto");
  };
  return (
    <>
      {/* container */}
      <div className="page-container slide-in">
        <p
          className="text-[#0063BF] text-[12px] sm:text-[14px] md:text-[16px] op animate-bounce lg:text-[18px] font-extrabold text-right p-5 cursor-pointer"
          onClick={handleClick2}
        >
          Skip
        </p>
        <div>
          <img src={logo} alt="" className="  max-w-[400px] mx-auto" />
        </div>
        <div>
          <img src={un} alt="" className="max-w-[500px] mx-auto" />
        </div>
        <p
          className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-center mt-5"
          text="BUY, SELL & SWAP CRYPTO op"
        >
          Sell Your Crypto Asset
        </p>
        <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] op font-semibold max-w-[340px] mx-auto text-center mt-2">
          Need to convert your crypto back to fiat? Selling your assets is quick
          and secure. Choose the cryptocurrency you want to sell, enter the
          amount, and see your estimated payout instantly.
        </p>
      </div>

      <div className="flex items-center gap-[15px] justify-center mt-8">
        <Link
          to="/buy-crypto"
          className=" bg-[#E3EAF2] w-[15px] h-[15px] rounded-full"
        >
          {" "}
          <span className="bg-[#E3EAF2] w-[15px] h-[15px] rounded-full"></span>
        </Link>

        <span
          className="bg-[#0063BF] cursor-pointer w-[15px] h-[15px] rounded-full"
          onClick={handleClick}
        ></span>

        <span
          onClick={handleClick2}
          className="bg-[#E3EAF2] cursor-pointer w-[15px] h-[15px] rounded-full"
        ></span>
      </div>
      {/* end of container */}
    </>
  );
};

export default SellCrypto;
