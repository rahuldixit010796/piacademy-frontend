"use client";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="1500px:w-[16%] w-1/5">
        <AdminSidebar />
      </div>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
