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
import Auth from "./user/pages/Auth";
import LandingPage from "./user/pages/LandingPage";
import Signup from "./user/pages/Signup";
import AboutUs from "./user/pages/AboutUs";
import TermsOfService from "./user/pages/TermsOfService";
import PrivacyPolicy from "./user/pages/PrivacyPolicy";
import AMLPolicy from "./user/pages/AMLPolicy";
import { Careers, Press } from "./user/pages/CompanyPages";

const Routee = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/buy-crypto" element={<BuyCrypto />} />
        <Route path="/sell-crypto" element={<SellCrypto />} />
        <Route path="/seamless-crypto" element={<SeamCrypto />} />
        <Route path="/currency-change" element={<CurrencyPage />} />
        <Route path="/admin-login" element={<CheeseBallLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/aml" element={<AMLPolicy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
      </Routes>
    </>
  );
};

export default Routee;
