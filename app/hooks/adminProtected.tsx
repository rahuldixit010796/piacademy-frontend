"use client";
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);

  // Show nothing or a loader while user is not resolved yet
  if (user === null || user === undefined) {
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  }

  return user?.role === "admin" ? children : redirect("/");
}
