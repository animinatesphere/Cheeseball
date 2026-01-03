import React from "react";
import logo from "../assets/CHEESEBALL 1.png";
import un from "../assets/undraw_transfer-money_h9s3 1.png";
import { Link, useNavigate } from "react-router-dom";

const BuyCrypto = () => {
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
          className="text-[#0063BF] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-extrabold text-right p-5 cursor-pointer"
          onClick={handleClick}
        >
          Skip
        </p>
        <div>
          <img src={logo} alt="" className="max-w-[400px] mx-auto" />
        </div>
        <div>
          <img src={un} alt="" className="max-w-[500px] mx-auto" />
        </div>
        <p
          className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-center mt-5"
          text="BUY, SELL & SWAP CRYPTO op"
        >
          Buy Crypto in Minutes
        </p>
        <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] op font-semibold max-w-[340px] mx-auto text-center mt-2">
          Ready to dive into the world of digital currency? Easily purchase
          Bitcoin, Ethereum, and many other cryptocurrencies with your preferred
          payment method
        </p>
      </div>

      <div className="flex items-center gap-[15px] justify-center mt-8">
        <Link
          to="/buy-crypto"
          className="bg-[#0063BF] w-[15px] h-[15px] rounded-full"
        >
          {" "}
          <span className="bg-[#0063BF] w-[15px] h-[15px] rounded-full"></span>
        </Link>

        <span
          className="bg-[#E3EAF2] cursor-pointer w-[15px] h-[15px] rounded-full"
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

export default BuyCrypto;
