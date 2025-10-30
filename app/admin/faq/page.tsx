"use client";
import React, { useState } from "react";
import {
  useGetAllFaqsAdminQuery,
  useAnswerFaqMutation,
  useDeleteFaqMutation,
  useSeedDefaultsMutation,
} from "@/redux/features/faq/faqApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/features/store";

export default function AdminFaqPage() {
  const { data, isLoading, refetch } = useGetAllFaqsAdminQuery();
  const [answerFaq, { isLoading: isAnswering }] = useAnswerFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  const [seedDefaults, { isLoading: isSeeding }] = useSeedDefaultsMutation();
  const user = useSelector((s: RootState) => (s as any).auth.user);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (user?.role !== "admin") {
    return <div className="p-6 text-red-600">Admin access only.</div>;
  }

  const pending = (data?.faqs || []).filter((f) => !f.isDefault && !f.isApproved);
  const visible = (data?.faqs || []).filter((f) => f.isDefault || f.isApproved);

  const submitAnswer = async (id: string) => {
    const text = (answers[id] || "").trim();
    if (!text) return;
    await answerFaq({ id, answer: text }).unwrap();
    setAnswers((a) => ({ ...a, [id]: "" }));
    refetch();
  };

  const removeFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await deleteFaq({ id }).unwrap();
    refetch();
  };

  const seed = async () => {
    await seedDefaults().unwrap();
    refetch();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FAQ Moderation</h1>
        <button onClick={seed} disabled={isSeeding} className="px-3 py-1 rounded-md border">
          {isSeeding ? "Seeding..." : "Seed Top 10 Defaults"}
        </button>
      </div>

      {/* Pending (awaiting admin answer) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pending Questions</h2>
        {isLoading && <div>Loading…</div>}
        {!isLoading && !pending.length && <div className="text-sm text-gray-500">No pending questions.</div>}
        {pending.map((f) => (
          <div key={f._id} className="border rounded-md p-4 space-y-2">
            <div className="font-medium">{f.question}</div>
            <textarea
              className="w-full border rounded-md p-2"
              placeholder="Type answer…"
              value={answers[f._id] || ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [f._id]: e.target.value }))}
            />
            <div className="flex gap-2">
              <button
                onClick={() => submitAnswer(f._id)}
                disabled={isAnswering}
                className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                {isAnswering ? "Saving…" : "Save & Approve"}
              </button>
              <button
                onClick={() => removeFaq(f._id)}
                disabled={isDeleting}
                className="px-3 py-1 rounded-md border text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Visible (defaults + approved) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Visible FAQs</h2>
        {visible.map((f) => (
          <div key={f._id} className="border rounded-md p-4">
            <div className="font-medium">{f.question}</div>
            {f.answer ? <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{f.answer}</div> : <div className="text-xs text-gray-500">No answer</div>}
            <div className="mt-2">
              <button onClick={() => removeFaq(f._id)} disabled={isDeleting} className="px-3 py-1 rounded-md border text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
