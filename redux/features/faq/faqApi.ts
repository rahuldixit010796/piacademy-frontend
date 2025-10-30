import { apiSlice } from "../api/apiSlice";

export type Faq = {
  _id: string;
  question: string;
  answer?: string | null;
  isDefault: boolean;
  isApproved: boolean;
  askedBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const faqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicFaqs: builder.query<{ success: boolean; faqs: Faq[] }, void>({
      query: () => ({ url: "faq/public", method: "GET" }),
      providesTags: ["FAQ" as any],
    }),
    submitQuestion: builder.mutation<{ success: boolean; faq: Faq }, { question: string }>({
      query: (body) => ({ url: "faq/create", method: "POST", body }),
      invalidatesTags: ["FAQ" as any],
    }),
    // Admin
    getAllFaqsAdmin: builder.query<{ success: boolean; faqs: Faq[] }, void>({
      query: () => ({ url: "faq/admin/all", method: "GET" }),
      providesTags: ["FAQ" as any],
    }),
    answerFaq: builder.mutation<{ success: boolean; faq: Faq }, { id: string; answer: string }>({
      query: ({ id, answer }) => ({ url: `faq/admin/answer/${id}`, method: "POST", body: { answer } }),
      invalidatesTags: ["FAQ" as any],
    }),
    deleteFaq: builder.mutation<{ success: boolean; message: string }, { id: string }>({
      query: ({ id }) => ({ url: `faq/admin/${id}`, method: "DELETE" }),
      invalidatesTags: ["FAQ" as any],
    }),
    seedDefaults: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({ url: "faq/admin/seed-defaults", method: "POST" }),
      invalidatesTags: ["FAQ" as any],
    }),
  }),
});

export const {
  useGetPublicFaqsQuery,
  useSubmitQuestionMutation,
  useGetAllFaqsAdminQuery,
  useAnswerFaqMutation,
  useDeleteFaqMutation,
  useSeedDefaultsMutation,
} = faqApi;
