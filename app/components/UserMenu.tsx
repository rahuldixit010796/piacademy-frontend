"use client";
import React, { useState } from "react";
import { useRegisterMutation, useLoginMutation } from "@/redux/features/auth/authApi";

const AvatarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<"instructor" | "student">("student"); // default
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const handleRegister = async () => {
    try {
      await register({ ...form, role }).unwrap();
      alert("✅ Registered successfully!");
      setIsModalOpen(false);
    } catch (err: any) {
      alert("❌ Registration failed: " + (err?.data?.message || "Unknown error"));
    }
  };

  const handleLogin = async () => {
    try {
      await login({ email: form.email, password: form.password }).unwrap();
      alert("✅ Logged in successfully!");
      setIsModalOpen(false);
    } catch (err: any) {
      alert("❌ Login failed: " + (err?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
      >
        👤
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20">
          <button
            onClick={() => {
              setRole("instructor");
              setIsModalOpen(true);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Sign in / Sign up 
          </button>
    
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              {role === "instructor" ? "Instructor" : "Student"} Login / Signup
            </h2>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2 mb-3 border rounded"
            />

            <div className="flex justify-between">
              <button
                onClick={handleRegister}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Register
              </button>
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
