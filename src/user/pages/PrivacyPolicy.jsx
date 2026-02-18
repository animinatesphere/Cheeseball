import React from "react";
import SharedFooterLayout from "../components/SharedFooterLayout";

const PrivacyPolicy = () => {
  return (
    <SharedFooterLayout title="Privacy Policy">
      <p className="mb-8 text-sm text-gray-400 uppercase font-black tracking-widest">Last Updated: February 2024</p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">1. Information We Collect</h2>
      <p className="mb-8">
        We collect information you provide directly to us when you create an account, 
        perform a transaction, or contact support. This may include your name, 
        email address, phone number, and transaction details.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">2. How We Use Your Information</h2>
      <p className="mb-8">
        We use the information we collect to provide, maintain, and improve our services, 
        to process your transactions, and to send you technical notices and support messages.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">3. Data Security</h2>
      <p className="mb-8">
        Cheeseball takes reasonable measures to help protect information about you 
        from loss, theft, misuse and unauthorized access, disclosure, alteration 
        and destruction. We use industry-standard encryption for all data transmissions.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">4. Cookies</h2>
      <p className="mb-8">
        We use cookies to enhance your experience, remember your preferences, and 
        analyze how our platform is used. You can manage your cookie preferences 
        through your browser settings.
      </p>
    </SharedFooterLayout>
  );
};

export default PrivacyPolicy;
