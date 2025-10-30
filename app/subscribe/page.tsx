"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useCreateOrderMutation, useVerifyPaymentMutation, useMySubscriptionQuery } from "@/redux/features/payments/razorpayApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/features/store";

const PLANS = [
  { years: 1 as const, label: "1 Year", priceINR: 2999 },
  { years: 2 as const, label: "2 Years", priceINR: 4999 },
  { years: 3 as const, label: "3 Years", priceINR: 6999 },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscribePage() {
  const { user } = useSelector((s: RootState) => (s as any).auth);
  const { data: mySub } = useMySubscriptionQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [selected, setSelected] = useState<1|2|3>(1);

  const active = mySub?.subscription;

  const startCheckout = async () => {
    if (!user?._id) return alert("Please login to purchase a subscription.");

    const orderRes = await createOrder({ years: selected }).unwrap();

    const options = {
      key: orderRes.keyId,
      amount: orderRes.amount,
      currency: "INR",
      name: "PI-Academy",
      description: `${orderRes.plan.label} Subscription`,
      order_id: orderRes.orderId,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      handler: async function (response: any) {
        // verify on server
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();
          alert("Subscription activated!");
          window.location.reload();
        } catch (e: any) {
          alert(e?.data?.message || "Verification failed");
        }
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <h1 className="text-2xl font-bold">Choose your subscription</h1>

      {active ? (
        <div className="border rounded p-4 bg-green-50">
          <div className="font-medium">Active Subscription</div>
          <div className="text-sm">
            Plan: {active.plan?.label} • Ends on {new Date(active.endsAt).toLocaleDateString()}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(p => (
            <button
              key={p.years}
              onClick={() => setSelected(p.years)}
              className={`border rounded p-4 text-left ${selected===p.years ? "ring-2 ring-blue-600" : ""}`}
            >
              <div className="text-lg font-semibold">{p.label}</div>
              <div className="text-sm text-gray-600">Access to all courses for {p.years} {p.years>1?"years":"year"}.</div>
              <div className="mt-2 text-xl font-bold">₹{p.priceINR}</div>
            </button>
          ))}
        </div>
      )}

      {!active && (
        <div className="flex justify-end">
          <button
            onClick={startCheckout}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? "Creating order..." : "Pay with Razorpay"}
          </button>
        </div>
      )}
    </div>
  );
}
