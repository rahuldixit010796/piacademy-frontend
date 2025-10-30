"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/features/store";
import {
  useUpdateUserInfoMutation,
  useUpdateProfilePictureMutation,
} from "@/redux/features/auth/authApi";
import { Camera, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { userUpdated } from "@/redux/features/auth/authSlice"; // ✅ Add this import at the top


const AboutMePage = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [updateUserInfo, { isLoading: saving }] = useUpdateUserInfoMutation();
  const [updateProfilePicture, { isLoading: picLoading }] =
    useUpdateProfilePictureMutation();

  const [checking, setChecking] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    collegeName: user?.collegeName || "",
    className: user?.className || "",
    contact: user?.contact || "",
    favoriteSubject: user?.favoriteSubject || "",
    dream: user?.dream || "",
    about: user?.about || "",
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");
  const [showEdit, setShowEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const dispatch = useDispatch();

function focusNextInput(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") {
    const form = e.currentTarget.form;
    if (!form) return;
    const index = Array.prototype.indexOf.call(form, e.currentTarget);

    // if not last field → move to next
    if (index < form.elements.length - 1) {
      e.preventDefault();
      const next = form.elements[index + 1] as HTMLElement | null;
      next?.focus();
    }
    // if last field → do nothing → allow Enter to submit
  }
}

  // 🔒 Redirect if not logged in
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user) {
        router.push("/"); // redirect unauthenticated users
      }
      setChecking(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [user, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="loader border-t-4 border-blue-600 rounded-full w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!user) return null; // prevent flicker during redirect

  // 🧩 Handle form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
// 🖼️ Handle avatar upload (fixed)
const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return alert("Please select an image.");

  try {
    // Convert file to Base64 safely
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string" && reader.result.startsWith("data:image/")) {
          resolve(reader.result);
        } else {
          reject("Invalid image data");
        }
      };
      reader.onerror = () => reject("File reading failed");
    });

    setAvatarPreview(base64);

    // Call backend
    const result = await updateProfilePicture({ avatar: base64 }).unwrap();
    if (result?.success) {
      dispatch(userUpdated({ avatar: { url: result.user?.avatar?.url } }));
      alert("✅ Profile picture updated successfully!");
    } else {
      alert(result?.message || "Cloudinary upload failed.");
    }
  } catch (err: any) {
    console.error("❌ Upload failed:", err);
    alert("❌ Failed to update profile picture.");
  }
};


  // 🗑️ Handle avatar removal
  const handleRemoveAvatar = async () => {
    if (!confirm("Remove profile picture?")) return;
    try {
      await updateProfilePicture({ avatar: "remove" }).unwrap();
      setAvatarPreview("");
      alert("🗑️ Profile picture removed!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove avatar");
    }
  };

  // 💾 Handle save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateUserInfo(formData).unwrap();
      if (res?.user) {
        setFormData({
          name: res.user.name || "",
          collegeName: res.user.collegeName || "",
          className: res.user.className || "",
          contact: res.user.contact || "",
          favoriteSubject: res.user.favoriteSubject || "",
          dream: res.user.dream || "",
          about: res.user.about || "",
        });
        alert("✅ Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    }
  };

  // 🌗 MAIN UI
  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-[100px] pb-16 bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black transition-colors duration-500">
      {/* About Me Card */}
      <div className="max-w-4xl w-[90%] md:w-[80%] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            🙋 About Me
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* VIEW MODE */}
        {!isEditing ? (
          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Image
                src={avatarPreview || "/default-avatar.png"}
                alt="Avatar"
                width={150}
                height={150}
                className="rounded-full border-4 border-blue-500 shadow-lg object-cover"
              />
              <h3 className="text-xl font-semibold mt-3 text-gray-900 dark:text-gray-100">
                {formData.name || "Unnamed User"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>

            {/* Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
              {[
                ["🎓 College Name", formData.collegeName],
                ["🏫 Class", formData.className],
                ["📞 Contact", formData.contact],
                ["📘 Favorite Subject", formData.favoriteSubject],
                ["🌠 Dream", formData.dream],
              ].map(([label, value]) => (
                <div key={label}>
                  <h4 className="font-semibold">{label}</h4>
                  <p>{value || "Not provided"}</p>
                </div>
              ))}

              <div className="md:col-span-2">
                <h4 className="font-semibold">💬 About</h4>
                <p>{formData.about || "Tell something about yourself!"}</p>
              </div>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Avatar Edit */}
            <div className="flex flex-col items-center">
              <div
                className="relative group"
                onMouseEnter={() => setShowEdit(true)}
                onMouseLeave={() => setShowEdit(false)}
              >
                <Image
                  src={avatarPreview || "/default-avatar.png"}
                  alt="Avatar"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border shadow-md"
                />
                {showEdit && (
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 rounded-full transition">
                    <label htmlFor="avatarInput" className="cursor-pointer text-white">
                      <Camera className="w-6 h-6" />
                    </label>
                    <input
                      id="avatarInput"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  className="text-red-600 mt-2 flex items-center gap-1 hover:underline"
                  type="button"
                >
                  <Trash size={16} /> Remove
                </button>
              )}
            </div>

            {/* Input Fields */}
            {[
              { label: "Name", name: "name" },
              { label: "College Name", name: "collegeName" },
              { label: "Class Name", name: "className" },
              { label: "Contact", name: "contact" },
              { label: "Favorite Subject", name: "favoriteSubject" },
              { label: "Dream", name: "dream" },
            ].map((field) => (
              <input
                key={field.name}
                type="text"
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                onKeyDown={focusNextInput}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              />
            ))}

            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="About yourself..."
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              rows={4}
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AboutMePage;
