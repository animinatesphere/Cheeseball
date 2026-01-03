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
      <div className="flex flex-col mt-8 page-container slide-in">
        <div className="flex justify-end w-full">
          <button
            onClick={handleSkip}
            className="text-[#0063BF] font-extrabold p-4"
          >
            Skip
          </button>
        </div>
        <div>
          <img src={logo} alt="" className="max-w-[350px] mx-auto" />
        </div>
        <div>
          <img src={man} alt="" className="max-w-[400px] mx-auto " />
        </div>

        <div>
          <p
            className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bold text-center"
            text="BUY, SELL & SWAP CRYPTO"
          >
            BUY, SELL & SWAP CRYPTO
          </p>
        </div>
        <Link to="/welcome" className="flex items-center ">
          <button className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] bg-[#0063BF] w-full sm:w-[292px] h-[54px] text-white mx-auto rounded-3xl font-bold op mt-5">
            Get started
          </button>
        </Link>
      </div>
      {/* end of parent */}
    </>
  );
};

export default Onboarding;
