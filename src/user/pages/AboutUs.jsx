import React from "react";
import SharedFooterLayout from "../components/SharedFooterLayout";

const AboutUs = () => {
  return (
    <SharedFooterLayout title="About Us">
      <p className="mb-8">
        Welcome to Cheeseball, Nigeria's premier cryptocurrency exchange platform. 
        Founded with a mission to simplify crypto trading, we are dedicated to providing 
        a seamless, secure, and lightning-fast experience for all our users.
      </p>
      
      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Our Mission</h2>
      <p className="mb-8">
        To bridge the gap between traditional finance and the digital asset economy in Africa, 
        starting with Nigeria. We believe that everyone should have access to the global 
        crypto market with the ease of a mobile app.
      </p>

      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Our Story</h2>
      <p className="mb-8">
        Cheeseball was born out of the frustration of slow transaction times and 
        unreliable exchange rates. We built a system that prioritizes the user, 
        ensuring that every trade is executed at the best possible price with 
        maximum transparency.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 italic">
          "We aren't just building a platform; we're building the future of financial freedom in Nigeria."
        </div>
      </div>
    </SharedFooterLayout>
  );
};

export default AboutUs;
