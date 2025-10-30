"use client";

import Image from "next/image";
import Link from "next/link";

export default function TeachOnPiPage() {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* HERO (full width) */}
      <section className="w-full border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          {/* Text Left */}
          <div className="space-y-5">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Become an Instructor on <span className="text-indigo-600">Pi-Academy</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Teach what you know. Inspire learners. Build your brand and earn as your course grows.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* 👉 Decide later where this should go; replace href when you’re ready */}
              <Link
                href="#start-teaching"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700 transition"
              >
                Start Teaching
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Explore Courses
              </Link>
            </div>
            <ul className="flex flex-wrap gap-6 pt-4 text-sm text-gray-500 dark:text-gray-400">
              <li>✔ Teach your way</li>
              <li>✔ Global audience</li>
              <li>✔ Simple payouts</li>
            </ul>
          </div>

          {/* Illustration Right (inline SVG so it works without assets) */}
          <div className="relative mx-auto w-full max-w-[540px] aspect-[4/3]">
            <svg viewBox="0 0 800 600" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
                <linearGradient id="g2" x1="0" x2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
              {/* Background */}
              <rect x="0" y="0" width="800" height="600" fill="none" />
              {/* Teacher */}
              <circle cx="560" cy="170" r="50" fill="url(#g1)" opacity="0.15" />
              <circle cx="560" cy="170" r="40" fill="#8b5cf6" />
              <rect x="500" y="220" width="120" height="150" rx="16" fill="#111827" opacity="0.9" />
              <rect x="510" y="230" width="100" height="10" rx="5" fill="#22c55e" />
              <rect x="510" y="250" width="100" height="10" rx="5" fill="#3b82f6" />
              <rect x="510" y="270" width="72" height="10" rx="5" fill="#a855f7" />
              <rect x="510" y="300" width="100" height="52" rx="10" fill="#0ea5e9" opacity="0.25" />

              {/* Students */}
              <circle cx="210" cy="220" r="36" fill="#22c55e" opacity="0.8" />
              <rect x="160" y="270" width="100" height="80" rx="14" fill="#111827" opacity="0.9" />
              <rect x="170" y="282" width="80" height="10" rx="5" fill="#f59e0b" />
              <rect x="170" y="300" width="56" height="10" rx="5" fill="#a78bfa" />

              <circle cx="320" cy="330" r="28" fill="#ef4444" opacity="0.8" />
              <rect x="280" y="370" width="90" height="70" rx="14" fill="#111827" opacity="0.9" />
              <rect x="290" y="382" width="70" height="10" rx="5" fill="#22c55e" />
              <rect x="290" y="400" width="46" height="10" rx="5" fill="#60a5fa" />

              {/* Board */}
              <rect x="90" y="120" width="380" height="200" rx="16" fill="#0f172a" opacity="0.9" />
              <rect x="110" y="150" width="130" height="16" rx="8" fill="#22c55e" />
              <rect x="110" y="178" width="210" height="12" rx="6" fill="#60a5fa" />
              <rect x="110" y="198" width="180" height="12" rx="6" fill="#a78bfa" />
              <rect x="110" y="218" width="240" height="12" rx="6" fill="#f59e0b" />
              <rect x="110" y="250" width="300" height="40" rx="10" fill="url(#g2)" opacity="0.35" />
            </svg>
          </div>
        </div>
      </section>

      {/* WHY TEACH */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why teach on Pi-Academy?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Teach your way",
                desc: "Design your curriculum, set your pace, and craft your teaching style.",
              },
              {
                title: "Inspire learners",
                desc: "Reach learners across regions and help them build real-world skills.",
              },
              {
                title: "Earn as you grow",
                desc: "Get paid on each paid enrollment with transparent reporting.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="w-full bg-gray-50 dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {[
            { n: "10k+", label: "Learners" },
            { n: "500+", label: "Instructors" },
            { n: "1k+", label: "Courses" },
            { n: "40+", label: "Countries" },
            { n: "12+", label: "Languages" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold">{s.n}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How teaching works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "Plan",
                desc: "Pick a topic you love. Outline clear learning goals and outcomes.",
              },
              {
                step: "Record",
                desc: "Use your phone, mic, or screen capture. Keep lessons concise and practical.",
              },
              {
                step: "Publish",
                desc: "Upload your lessons, set price, and share. We handle hosting and distribution.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6 shadow-sm"
              >
                <div className="text-indigo-600 font-bold text-sm mb-1">Step {i + 1}</div>
                <h3 className="text-lg font-semibold mb-2">{s.step}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="w-full bg-gray-50 dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">You won’t have to do it alone</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our team is here to help with course setup, quality checks, and best practices. Join a
              community of instructors sharing tips, tools, and templates.
            </p>
          </div>
          {/* Simple secondary illustration */}
          <div className="relative mx-auto w-full max-w-[520px] aspect-[16/10]">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              <rect x="0" y="0" width="800" height="500" fill="none" />
              <rect x="120" y="120" width="560" height="260" rx="18" fill="#0f172a" opacity="0.9" />
              <rect x="150" y="160" width="220" height="16" rx="8" fill="#22c55e" />
              <rect x="150" y="188" width="300" height="12" rx="6" fill="#60a5fa" />
              <rect x="150" y="208" width="260" height="12" rx="6" fill="#a78bfa" />
              <rect x="150" y="228" width="340" height="12" rx="6" fill="#f59e0b" />
              <rect x="150" y="260" width="420" height="50" rx="12" fill="#6366f1" opacity="0.25" />
            </svg>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to start teaching?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Share your expertise and help learners level up — your first course can be live in days.
          </p>
          {/* 👉 Replace href later with your chosen destination */}
         <Link
  id="start-teaching"
  href="/teach-on-pi/form?from=landing"
  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition"
>
  Start Teaching
</Link>
        </div>
      </section>
    </main>
  );
}
