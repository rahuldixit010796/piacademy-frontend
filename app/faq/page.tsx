"use client";
import React, { useState } from "react";
import { useGetPublicFaqsQuery, useSubmitQuestionMutation } from "@/redux/features/faq/faqApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/features/store";

export default function FaqPage() {
  const { data, isLoading, isError } = useGetPublicFaqsQuery();
  const [question, setQuestion] = useState("");
  const [submitQuestion, { isLoading: isSubmitting }] = useSubmitQuestionMutation();
  const { user } = useSelector((state: RootState) => state.auth);

  const onSubmit = async () => {
    if (!user?._id) return alert("Please log in to ask a question.");
    if (!question.trim()) return;
    try {
      await submitQuestion({ question: question.trim() }).unwrap();
      setQuestion("");
      alert("Thanks! Your question was submitted and will appear after admin answers.");
    } catch (e: any) {
      alert(e?.data?.message || "Failed to submit question.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>

      <div className="space-y-3">
        {isLoading && <div>Loading...</div>}
        {isError && <div className="text-red-600">Failed to load FAQs.</div>}
        {data?.faqs?.map((f) => (
          <div key={f._id} className="border rounded-md p-4">
            <div className="font-medium">{f.question}</div>
            {f.answer ? (
              <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{f.answer}</div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">Awaiting admin answer</div>
            )}
          </div>
        ))}
        {!isLoading && !data?.faqs?.length && <div>No FAQs yet.</div>}
      </div>

     {user?._id && user.role !== "admin" ? (
  // ✅ show ask form only for non-admin users
  <div className="border rounded-md p-4 space-y-2">
    <div className="font-medium">Ask a question</div>
    <textarea
      className="w-full border rounded-md p-2 min-h-[90px]"
      placeholder="Type your question..."
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
    />
    <div className="flex justify-end">
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  </div>
) : !user?._id ? (
  // 🔐 not logged in
  <div className="border rounded-md p-4 text-center text-gray-500 text-sm">
    You must be logged in to submit a question.
  </div>
) : null}

    </div>
  );
}
  

