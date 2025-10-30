// src/redux/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";
import type { RootState } from "../store"; // ✅ ensure RootState type exists

// ✅ Ensure baseUrl always ends with a single slash
const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl, // ✅ uses fixed, consistent base URL (no double /api/v1)
    credentials: "include", // ✅ send cookies automatically

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["User", "Auth","FAQ"],

  endpoints: (builder) => ({
    // 🔄 Refresh token endpoint
    refreshToken: builder.query({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),

    // 👤 Load current user
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const { accessToken, user } = result?.data || {};

          if (user) {
            dispatch(
              userLoggedIn({
                accessToken: accessToken || null,
                user,
              })
            );
          } else {
            console.warn("⚠️ No user found in /me response:", result);
          }
        } catch (error: any) {
          const msg =
            error?.data?.message ||
            error?.error ||
            error?.message ||
            "Failed to load user data.";
          console.warn("❌ LoadUser failed:", msg);
        }
      },
    }),
  }),
});

// ✅ Export RTK Query hooks
export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
