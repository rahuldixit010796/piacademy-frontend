"use client";
import React from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import DashboardHero from "../components/Admin/DashboardHero";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/features/store";
import { redirect } from "next/navigation";

const AdminPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // 🚫 Block access if not admin
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      {/* Page Metadata */}
      <Heading
        title="PI-Academy - Admin"
        description="PI-Academy admin panel for managing users, courses, analytics, and more."
        keywords="Admin, Dashboard, PI-Academy"
      />

      {/* Layout: Sidebar + Dashboard */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>

        {/* Dashboard Main Content */}
        <div className="w-[85%]">
          <DashboardHero isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
