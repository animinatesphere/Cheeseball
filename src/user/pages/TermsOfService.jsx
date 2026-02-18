import React from "react";
import SharedFooterLayout from "../components/SharedFooterLayout";

const TermsOfService = () => {
  return (
    <SharedFooterLayout title="Terms of Service">
      <p className="mb-8 text-sm text-gray-400 uppercase font-black tracking-widest">Last Updated: February 2024</p>
      
      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">1. Acceptance of Terms</h2>
      <p className="mb-8">
        By accessing or using the Cheeseball platform, you agree to be bound by these 
        Terms of Service and all applicable laws and regulations. If you do not agree 
        with any of these terms, you are prohibited from using this site.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">2. Use License</h2>
      <p className="mb-8">
        Cheeseball grants you a personal, non-exclusive, non-transferable license to 
        access our platform for personal, non-commercial use only. This license 
        does not include any resale or commercial use of our services.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">3. User Conduct</h2>
      <p className="mb-8">
        You agree not to use the platform for any unlawful purpose or in any way 
        that could damage, disable, or impair our services. You are responsible 
        for maintaining the confidentiality of your account credentials.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">4. Disclaimer</h2>
      <p className="mb-8">
        Cheeseball provides services on an "as is" basis. We make no warranties, 
        expressed or implied, and hereby disclaim and negate all other warranties 
        including, without limitation, implied warranties or conditions of 
        merchantability or fitness for a particular purpose.
      </p>
    </SharedFooterLayout>
  );
};

export default TermsOfService;
