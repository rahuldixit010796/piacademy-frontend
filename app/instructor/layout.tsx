"use client";

import { useState } from "react";
import InstructorSidebar from "@/app/components/instructor/Sidebar";

export default function InstructorRootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="1500px:w-[16%] w-1/5">
        <InstructorSidebar open={open} setOpen={setOpen} />
      </div>

      {/* Main */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
