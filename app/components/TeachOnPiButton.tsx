"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function TeachOnPiButton() {
  const router = useRouter();

  const handleTeachClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/user/instructor/status`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (data?.submitted === true) {
        router.push("/instructor/dashboard");
      } else {
        try { localStorage.removeItem("visitedTeachLanding"); } catch {}
        router.push("/teach-on-pi");
      }
    } catch {
      router.push("/teach-on-pi");
    }
  }, [router]);

  return (
    <a href="/teach-on-pi" onClick={handleTeachClick} className="...your classes...">
      Teach on Pi
    </a>
  );
}
