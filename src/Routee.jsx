import React from "react";
import { Route, Routes } from "react-router-dom";
import Onboarding from "./page/Onboarding";
import Welcome from "./page/Welcome";
import BuyCrypto from "./page/BuyCrypto";
import SellCrypto from "./page/SellCrypto";
import SeamCrypto from "./page/SeamCrypto";
import CurrencyPage from "./user/pages/CurrencyPage";
import CheeseBallLogin from "./admin/auth/CheeseBallLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
// import Navbar from "./user/components/Navbar";

const Routee = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/buy-crypto" element={<BuyCrypto />} />
        <Route path="/sell-crypto" element={<SellCrypto />} />
        <Route path="/seamless-crypto" element={<SeamCrypto />} />
        <Route path="/currency-change" element={<CurrencyPage />} />
        <Route path="/admin-login" element={<CheeseBallLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

export default Routee;
