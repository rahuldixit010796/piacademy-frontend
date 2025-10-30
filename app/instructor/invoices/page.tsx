"use client";

import React from "react";
import Heading from "@/app/utils/Heading";
// If you want exact duplicates later, create these instructor components;
// For now you can temporarily reuse admin ones by changing the imports.
import DashboardHeader from "@/app/components/Admin/DashboardHeader";
import AllInvoices from "@/app/components/Admin/Order/AllInvoices";

const page = () => {
  return (
    <div>
      <Heading
        title="PI-Academy - Instructor"
        description="PI-Academy is a platform for students to learn and get help from teachers"
        keywords="Mathematics,Physics,Chemistry"
      />
      <div className="flex">
        {/* Sidebar is already rendered by app/instructor/layout.tsx */}
        <div className="w-full">
          <DashboardHeader />
          <AllInvoices />
        </div>
      </div>
    </div>
  );
};

export default page;
