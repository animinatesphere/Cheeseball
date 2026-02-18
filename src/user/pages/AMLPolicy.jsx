import React from "react";
import SharedFooterLayout from "../components/SharedFooterLayout";

const AMLPolicy = () => {
  return (
    <SharedFooterLayout title="AML Policy">
      <p className="mb-8 text-sm text-gray-400 uppercase font-black tracking-widest">Anti-Money Laundering Framework</p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">1. Overview</h2>
      <p className="mb-8">
        Cheeseball is committed to the highest standards of Anti-Money Laundering (AML) 
        and Counter-Terrorist Financing (CTF) compliance. Our policy is designed to 
        prevent our platform from being used for illegal activities.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">2. Identity Verification (KYC)</h2>
      <p className="mb-8">
        We implement robust Know Your Customer (KYC) procedures. This includes 
        verifying the identity of all users through government-issued documents 
        and performing ongoing monitoring of transaction patterns.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">3. Transaction Monitoring</h2>
      <p className="mb-8">
        Our automated systems analyze every transaction for suspicious activity. 
        We use advanced tools to check for laundering patterns and interaction 
        with high-risk addresses.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">4. Reporting</h2>
      <p className="mb-8">
        Cheeseball cooperates fully with regulatory authorities. We report 
        suspicious activities to relevant agencies as required by law in 
        all jurisdictions where we operate.
      </p>
    </SharedFooterLayout>
  );
};

export default AMLPolicy;
