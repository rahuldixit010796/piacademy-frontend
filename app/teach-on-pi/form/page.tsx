"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/features/store";
import { useRouter, useSearchParams } from "next/navigation";

type Cat1 = { q1: string; q2: string; q3: string };
type Cat2 = { q4: string; q5: string; q6: string };
type Cat3 = { q7: string; q8: string; q9: string };
type Cat4 = { q10: string; q11: string; q12: string };

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function InstructorFormPage() {
  const router = useRouter();
  const params = useSearchParams()!;
  const user = useSelector((s: RootState) => s.auth.user);

  // ---- UI state ----
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<number>(1); // 1..4
  const [submitting, setSubmitting] = useState(false);

  // ---- Answers ----
  const [category1, setC1] = useState<Cat1>({ q1: "", q2: "", q3: "" });
  const [category2, setC2] = useState<Cat2>({ q4: "", q5: "", q6: "" });
  const [category3, setC3] = useState<Cat3>({ q7: "", q8: "", q9: "" });
  const [category4, setC4] = useState<Cat4>({ q10: "", q11: "", q12: "" });

  const progressPercent = useMemo(() => (step / 4) * 100, [step]);

  // ---- helpers ----
  const requireAnswered = useCallback(
    (s: number) => {
      if (s === 1) return !!(category1.q1 && category1.q2 && category1.q3);
      if (s === 2) return !!(category2.q4 && category2.q5 && category2.q6);
      if (s === 3) return !!(category3.q7 && category3.q8 && category3.q9);
      if (s === 4) return !!(category4.q10 && category4.q11 && category4.q12);
      return false;
    },
    [category1, category2, category3, category4]
  );

  const handleNext = useCallback(() => {
    if (!requireAnswered(step)) {
      alert("Please answer all questions on this step.");
      return;
    }
    setStep((p) => Math.min(4, p + 1));
  }, [requireAnswered, step]);

  const handlePrev = useCallback(() => {
    setStep((p) => Math.max(1, p - 1));
  }, []);

  // ---- gatekeeping (MongoDB only, no localStorage) ----
  useEffect(() => {
    // must be logged in
    if (user === null) {
      router.replace("/");
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        // enforce "from=landing" to ensure user saw the landing page first
        const from = params.get("from");
        if (from !== "landing") {
          router.replace("/teach-on-pi");
          return;
        }

        // if application already exists in DB => go to instructor dashboard
        const res = await fetch(`${API}/user/instructor/status`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (data?.submitted === true) {
          router.replace("/instructor/dashboard");
          return;
        }
      } catch {
        // on error, still block access (send back to landing)
        router.replace("/teach-on-pi");
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, router, params]);

  // ---- submit ----
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !requireAnswered(1) ||
      !requireAnswered(2) ||
      !requireAnswered(3) ||
      !requireAnswered(4)
    ) {
      alert("Please answer all questions in each category.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API}/user/instructor/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ category1, category2, category3, category4 }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to submit application");
      }
      router.replace("/instructor/dashboard");
    } catch (err: any) {
      alert(err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Radio ----
  const Radio = ({
    name,
    value,
    checked,
    onChange,
    label,
  }: {
    name: string;
    value: string;
    checked: boolean;
    onChange: (v: string) => void;
    label: string;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4"
      />
      <span>{label}</span>
    </label>
  );

  // ---- loading ----
  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3 text-gray-700 dark:text-gray-200">
          <div className="h-10 w-10 rounded-full border-4 border-gray-300 dark:border-gray-700 border-t-indigo-600 animate-spin" />
          <div className="text-sm">Preparing your instructor application…</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[100px] px-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Instructor Application</h1>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* STEP 1 */}
          {step === 1 && (
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-1">✅ Category 1 — Subject Expertise</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Helps us route you to the right audience and subject.
              </p>

              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-2">
                    Q1. What level do you want to teach on Pi-Academy?
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Radio name="q1" value="A" checked={category1.q1 === "A"} onChange={(v) => setC1({ ...category1, q1: v })} label="A) Class 6–8" />
                    <Radio name="q1" value="B" checked={category1.q1 === "B"} onChange={(v) => setC1({ ...category1, q1: v })} label="B) 9–10" />
                    <Radio name="q1" value="C" checked={category1.q1 === "C"} onChange={(v) => setC1({ ...category1, q1: v })} label="C) JEE/NEET" />
                    <Radio name="q1" value="D" checked={category1.q1 === "D"} onChange={(v) => setC1({ ...category1, q1: v })} label="D) College" />
                    <Radio name="q1" value="E" checked={category1.q1 === "E"} onChange={(v) => setC1({ ...category1, q1: v })} label="E) Other" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Q2. What is your strongest subject domain?</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Radio name="q2" value="A" checked={category1.q2 === "A"} onChange={(v) => setC1({ ...category1, q2: v })} label="A) Math" />
                    <Radio name="q2" value="B" checked={category1.q2 === "B"} onChange={(v) => setC1({ ...category1, q2: v })} label="B) Physics" />
                    <Radio name="q2" value="C" checked={category1.q2 === "C"} onChange={(v) => setC1({ ...category1, q2: v })} label="C) Chemistry" />
                    <Radio name="q2" value="D" checked={category1.q2 === "D"} onChange={(v) => setC1({ ...category1, q2: v })} label="D) Biology" />
                    <Radio name="q2" value="E" checked={category1.q2 === "E"} onChange={(v) => setC1({ ...category1, q2: v })} label="E) Other" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">
                    Q3. Can you solve previous-year competitive exam questions without reference?
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Radio name="q3" value="A" checked={category1.q3 === "A"} onChange={(v) => setC1({ ...category1, q3: v })} label="A) Yes" />
                    <Radio name="q3" value="B" checked={category1.q3 === "B"} onChange={(v) => setC1({ ...category1, q3: v })} label="B) No" />
                    <Radio name="q3" value="C" checked={category1.q3 === "C"} onChange={(v) => setC1({ ...category1, q3: v })} label="C) Only with preparation time" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-1">✅ Category 2 — Teaching Skill &amp; Pedagogy</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Checks your teaching approach and adaptability.
              </p>

              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-2">
                    Q4. If a student is not understanding after 2 tries, what do you do?
                  </p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <Radio name="q4" value="A" checked={category2.q4 === "A"} onChange={(v) => setC2({ ...category2, q4: v })} label="A) Repeat same way" />
                    <Radio name="q4" value="B" checked={category2.q4 === "B"} onChange={(v) => setC2({ ...category2, q4: v })} label="B) Change method" />
                    <Radio name="q4" value="C" checked={category2.q4 === "C"} onChange={(v) => setC2({ ...category2, q4: v })} label="C) Move on" />
                    <Radio name="q4" value="D" checked={category2.q4 === "D"} onChange={(v) => setC2({ ...category2, q4: v })} label="D) Give homework" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Q5. Do you use real-life examples for abstract topics?</p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <Radio name="q5" value="A" checked={category2.q5 === "A"} onChange={(v) => setC2({ ...category2, q5: v })} label="A) Always" />
                    <Radio name="q5" value="B" checked={category2.q5 === "B"} onChange={(v) => setC2({ ...category2, q5: v })} label="B) Sometimes" />
                    <Radio name="q5" value="C" checked={category2.q5 === "C"} onChange={(v) => setC2({ ...category2, q5: v })} label="C) Rarely" />
                    <Radio name="q5" value="D" checked={category2.q5 === "D"} onChange={(v) => setC2({ ...category2, q5: v })} label="D) Never" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Q6. How do you validate understanding?</p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <Radio name="q6" value="A" checked={category2.q6 === "A"} onChange={(v) => setC2({ ...category2, q6: v })} label="A) Ask them to solve" />
                    <Radio name="q6" value="B" checked={category2.q6 === "B"} onChange={(v) => setC2({ ...category2, q6: v })} label="B) Ask to explain back" />
                    <Radio name="q6" value="C" checked={category2.q6 === "C"} onChange={(v) => setC2({ ...category2, q6: v })} label="C) Give a quiz" />
                    <Radio name="q6" value="D" checked={category2.q6 === "D"} onChange={(v) => setC2({ ...category2, q6: v })} label="D) Assume it" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-1">✅ Category 3 — Ethics &amp; Content Authenticity</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Protects learners and our platform from copyright issues.
              </p>

              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-2">Q7. Do you create original teaching material?</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Radio name="q7" value="A" checked={category3.q7 === "A"} onChange={(v) => setC3({ ...category3, q7: v })} label="A) Yes" />
                    <Radio name="q7" value="B" checked={category3.q7 === "B"} onChange={(v) => setC3({ ...category3, q7: v })} label="B) No" />
                    <Radio name="q7" value="C" checked={category3.q7 === "C"} onChange={(v) => setC3({ ...category3, q7: v })} label="C) Mix (own + internet)" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Q8. Will you upload pirated/copyrighted content?</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <Radio name="q8" value="A" checked={category3.q8 === "A"} onChange={(v) => setC3({ ...category3, q8: v })} label="A) Yes if useful" />
                    <Radio name="q8" value="B" checked={category3.q8 === "B"} onChange={(v) => setC3({ ...category3, q8: v })} label="B) Only free/open source" />
                    <Radio name="q8" value="C" checked={category3.q8 === "C"} onChange={(v) => setC3({ ...category3, q8: v })} label="C) I don’t know" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">
                    Q9. If a student misbehaves publicly, what do you do?
                  </p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <Radio name="q9" value="A" checked={category3.q9 === "A"} onChange={(v) => setC3({ ...category3, q9: v })} label="A) Insult back" />
                    <Radio name="q9" value="B" checked={category3.q9 === "B"} onChange={(v) => setC3({ ...category3, q9: v })} label="B) Ignore" />
                    <Radio name="q9" value="C" checked={category3.q9 === "C"} onChange={(v) => setC3({ ...category3, q9: v })} label="C) Respond politely" />
                    <Radio name="q9" value="D" checked={category3.q9 === "D"} onChange={(v) => setC3({ ...category3, q9: v })} label="D) Report to system" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-1">✅ Category 4 — Commitment &amp; Consistency</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Ensures regular content and professional delivery.
              </p>

              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-2">Q10. Publishing frequency?</p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <Radio name="q10" value="A" checked={category4.q10 === "A"} onChange={(v) => setC4({ ...category4, q10: v })} label="A) Weekly" />
                    <Radio name="q10" value="B" checked={category4.q10 === "B"} onChange={(v) => setC4({ ...category4, q10: v })} label="B) Monthly" />
                    <Radio name="q10" value="C" checked={category4.q10 === "C"} onChange={(v) => setC4({ ...category4, q10: v })} label="C) Occasionally" />
                    <Radio name="q10" value="D" checked={category4.q10 === "D"} onChange={(v) => setC4({ ...category4, q10: v })} label="D) No commitment" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Q11. Comfortable recording lessons?</p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <Radio name="q11" value="A" checked={category4.q11 === "A"} onChange={(v) => setC4({ ...category4, q11: v })} label="A) Yes facecam" />
                    <Radio name="q11" value="B" checked={category4.q11 === "B"} onChange={(v) => setC4({ ...category4, q11: v })} label="B) Yes screen-only" />
                    <Radio name="q11" value="C" checked={category4.q11 === "C"} onChange={(v) => setC4({ ...category4, q11: v })} label="C) Both" />
                    <Radio name="q11" value="D" checked={category4.q11 === "D"} onChange={(v) => setC4({ ...category4, q11: v })} label="D) No" />
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Q12. Why do you want to teach on Pi-Academy?</p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <Radio name="q12" value="A" checked={category4.q12 === "A"} onChange={(v) => setC4({ ...category4, q12: v })} label="A) Earn money" />
                    <Radio name="q12" value="B" checked={category4.q12 === "B"} onChange={(v) => setC4({ ...category4, q12: v })} label="B) Share knowledge" />
                    <Radio name="q12" value="C" checked={category4.q12 === "C"} onChange={(v) => setC4({ ...category4, q12: v })} label="C) Build brand" />
                    <Radio name="q12" value="D" checked={category4.q12 === "D"} onChange={(v) => setC4({ ...category4, q12: v })} label="D) All of the above" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1 || submitting}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-6 py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-60"
            >
              Previous
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 font-medium transition disabled:opacity-60"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 font-medium transition disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
