import React from "react";
import SharedFooterLayout from "../components/SharedFooterLayout";

export const Careers = () => (
  <SharedFooterLayout title="Careers">
    <p className="mb-8">
      Cheeseball is always looking for brilliant minds to join our mission of 
      transforming crypto trading in Africa. We are a fast-growing team of 
      dreamers and doers.
    </p>
    <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 text-center">
      <h3 className="text-xl font-black mb-4">No Open Positions</h3>
      <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
        Check back soon or send your CV to careers@cheeseball.ng
      </p>
    </div>
  </SharedFooterLayout>
);

export const Press = () => (
  <SharedFooterLayout title="Press">
    <p className="mb-8">
      Get the latest news and brand assets from Cheeseball. We're happy to 
      collaborate with media partners to tell our story.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">February 2024</p>
        <h4 className="font-black text-lg mb-2">Cheeseball Hits 50k Users</h4>
        <p className="text-gray-500 text-sm">Cheeseball reaches a major milestone in user growth...</p>
      </div>
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm opacity-50">
        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Stay Tuned</p>
        <h4 className="font-black text-lg mb-2">More Updates Soon</h4>
        <p className="text-gray-500 text-sm">Join our newsletter to get press releases first.</p>
      </div>
    </div>
  </SharedFooterLayout>
);
