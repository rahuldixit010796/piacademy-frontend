"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/features/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function MyCoursesPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null; // avoid flicker

  // Later we will fetch courses.
  const purchasedCourses: any[] = []; // placeholder

  return (
    <div className="min-h-screen pt-[100px] px-6 bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">📚 My Courses</h1>

        {purchasedCourses.length === 0 ? (
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow text-center">
<p className="mb-4 text-lg">You haven&apos;t purchased any courses yet.</p>
            <Link
              href="/courses"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div>
            {/* In future replace with real purchased course cards */}
            <p>Purchased courses will show here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
