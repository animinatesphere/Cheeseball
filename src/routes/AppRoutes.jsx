import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/features/marketing/pages/LandingPage";
import Auth from "@/features/auth/pages/LoginPage";
import AuthSignup from "@/features/auth/pages/SignupPage";
import Verify from "@/features/auth/pages/VerifyAccountPage";
import EmailVerified from "@/features/auth/pages/EmailVerifiedPage";
import ForgotPassword from "@/features/auth/pages/ForgotPasswordPage";
import CurrencyPage from "@/features/dashboard/pages/DashboardPage";
import AboutUs from "@/features/marketing/pages/AboutUsPage";
import TermsOfService from "@/features/marketing/pages/TermsOfServicePage";
import PrivacyPolicy from "@/features/marketing/pages/PrivacyPolicyPage";
import AMLPolicy from "@/features/marketing/pages/AMLPolicyPage";
import { Careers, Press } from "@/features/marketing/pages/CompanyPages";
import { paths } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path={paths.home} element={<LandingPage />} />
    <Route path={paths.auth} element={<Auth />} />
    <Route path={paths.login} element={<Auth />} />
    <Route path={paths.signup} element={<AuthSignup />} />
    <Route path={paths.verifyAccount} element={<Verify />} />
    <Route path={paths.emailVerified} element={<EmailVerified />} />
    <Route path={paths.forgotPassword} element={<ForgotPassword />} />
    <Route 
      path={`${paths.dashboard}/*`} 
      element={
        <ProtectedRoute>
          <CurrencyPage />
        </ProtectedRoute>
      } 
    />
    <Route path={paths.about} element={<AboutUs />} />
    <Route path={paths.terms} element={<TermsOfService />} />
    <Route path={paths.privacy} element={<PrivacyPolicy />} />
    <Route path={paths.aml} element={<AMLPolicy />} />
    <Route path={paths.careers} element={<Careers />} />
    <Route path={paths.press} element={<Press />} />

    <Route path="/dashboard" element={<Navigate to={paths.dashboardHome} replace />} />
    <Route path="/buy" element={<Navigate to={paths.dashboardBuy} replace />} />
    <Route path="/swap" element={<Navigate to={paths.dashboardSwap} replace />} />
    <Route path="/buy-crypto" element={<Navigate to={paths.dashboardBuy} replace />} />
    <Route path="/sell-crypto" element={<Navigate to={paths.dashboardSell} replace />} />
    <Route path="/seamless-crypto" element={<Navigate to={paths.dashboardSwap} replace />} />
    <Route path="/register" element={<AuthSignup />} />
    <Route path="*" element={<Navigate to={paths.home} replace />} />
  </Routes>
);

export default AppRoutes;

