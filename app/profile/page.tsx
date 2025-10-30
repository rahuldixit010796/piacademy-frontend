"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/features/store";
import { useUpdateUserInfoMutation } from "@/redux/features/auth/authApi";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateUserInfoMutation();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    about: user?.about || "",
    className: user?.className || "",
    collegeName: user?.collegeName || "",
    contact: user?.contact || "",
    favoriteSubject: user?.favoriteSubject || "",
    dream: user?.dream || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(form).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh(); // reloads latest user from server
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No profile loaded. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-900 shadow rounded-xl space-y-6">
      <div className="flex items-center space-x-4">
        {user.avatar?.url ? (
          <Image
            src={user.avatar.url}
            alt={user.name}
            width={80}
            height={80}
            className="rounded-full border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-xl">{user.name?.[0].toUpperCase()}</span>
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
            {user.role}
          </span>
        </div>
      </div>

      {!isEditing ? (
        // ---------------- VIEW MODE ----------------
        <div className="space-y-4">
          {user.about && (
            <div>
              <h2 className="font-semibold">About Me</h2>
              <p>{user.about}</p>
            </div>
          )}
          {user.className && (
            <div>
              <h2 className="font-semibold">Class</h2>
              <p>{user.className}</p>
            </div>
          )}
          {user.collegeName && (
            <div>
              <h2 className="font-semibold">College</h2>
              <p>{user.collegeName}</p>
            </div>
          )}
          {user.contact && (
            <div>
              <h2 className="font-semibold">Contact</h2>
              <p>{user.contact}</p>
            </div>
          )}
          {user.favoriteSubject && (
            <div>
              <h2 className="font-semibold">Favorite Subject</h2>
              <p>{user.favoriteSubject}</p>
            </div>
          )}
          {user.dream && (
            <div>
              <h2 className="font-semibold">Dream</h2>
              <p>{user.dream}</p>
            </div>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        // ---------------- EDIT MODE ----------------
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border rounded p-2"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded p-2"
          />
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="About Me"
            className="w-full border rounded p-2 min-h-[100px]"
          />
          <input
            name="className"
            value={form.className}
            onChange={handleChange}
            placeholder="Class"
            className="w-full border rounded p-2"
          />
          <input
            name="collegeName"
            value={form.collegeName}
            onChange={handleChange}
            placeholder="College"
            className="w-full border rounded p-2"
          />
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="w-full border rounded p-2"
          />
          <input
            name="favoriteSubject"
            value={form.favoriteSubject}
            onChange={handleChange}
            placeholder="Favorite Subject"
            className="w-full border rounded p-2"
          />
          <input
            name="dream"
            value={form.dream}
            onChange={handleChange}
            placeholder="Dream"
            className="w-full border rounded p-2"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
