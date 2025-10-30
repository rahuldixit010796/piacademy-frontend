import { apiSlice } from "../api/apiSlice";

export const razorpayApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, { years: 1 | 2 | 3 }>({
      query: (body) => ({ url: "subscription/order", method: "POST", body }),
    }),
    verifyPayment: builder.mutation<any, { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }>({
      query: (body) => ({ url: "subscription/verify", method: "POST", body }),
    }),
    mySubscription: builder.query<{ success: true; subscription: any | null }, void>({
      query: () => ({ url: "subscription/me", method: "GET" }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation, useMySubscriptionQuery } = razorpayApi;
