// src/redux/features/auth/authApi.ts
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userUpdated } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // 📝 Register User
    register: builder.mutation({
      query: (data: any) => ({
        url: "user/registration", // ✅ becomes http://localhost:5000/api/v1/registration
        method: "POST",
        body: data,
      }),
    }),

    // 🔐 Activate Account (OTP verification)
    activation: builder.mutation({
      query: ({ activation_token, activation_code }: any) => ({
        url: "user/activate-user",
        method: "POST",
        body: { activation_token, activation_code },
      }),
    }),

    // 🔑 Login User
    login: builder.mutation({
      query: (data) => ({
        url: "user/login",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (!data?.accessToken || !data?.user) {
            console.warn("⚠️ Login response missing fields:", data);
            return;
          }
          const user = { ...data.user, role: data.user?.role || "user" };
          dispatch(userLoggedIn({ accessToken: data.accessToken, user }));
          console.log("✅ Login success:", user.email || user._id);
        } catch (err: any) {
          console.error(
            "❌ Login failed:",
            JSON.stringify(err?.data || err?.error || err, null, 2)
          );
        }
      },
    }),

    // 🌐 Social Auth (Google)
    socialAuth: builder.mutation({
      query: (data: any) => ({
        url: "social-auth",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const user = { ...result.data.user, role: result.data.user?.role || "user" };
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken || result.data.token,
              user,
            })
          );
          console.log("✅ Google login success:", user.email || user._id);
        } catch (err: any) {
          console.error(
            "❌ Social login failed:",
            JSON.stringify(err?.data || err?.error || err, null, 2)
          );
        }
      },
    }),

    // 👥 Get All Users (Admin)
    getAllUsers: builder.query({
      query: () => ({
        url: "user/admin/users",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // 🔄 Update User Role (Admin)
    updateUserRole: builder.mutation({
      query: (data: { email: string; role: string }) => ({
        url: "user/admin/user-role",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // ❌ Delete User (Admin)
      blockUser: builder.mutation({
  query: (body: { id: string; block: boolean }) => ({
    url: "user/admin/block-user",
    method: "PUT",
    body,
    credentials: "include",
  }),
}),
    // ❌ Delete User (Admin)
    deleteByAdmin: builder.mutation({
      query: (id: string) => ({
        url: `user/admin/user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    // 🔁 Forgot Password → Send OTP
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "user/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // 🔁 Reset Password via OTP
    resetPasswordOtp: builder.mutation({
      query: (body) => ({
        url: "user/reset-password-otp",
        method: "POST",
        body,
      }),
    }),

    // 🚪 Logout
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include",
      }),
    }),

    // 🗑️ Self-Delete Request
    deleteAccountRequest: builder.mutation({
      query: () => ({
        url: "me/delete-request",
        method: "POST",
        credentials: "include" as const,
      }),
    }),

    // ✅ Confirm Delete Account
    confirmDeleteAccount: builder.mutation({
      query: (data) => ({
        url: "me/delete-confirm",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    // 👤 Update Profile Info
    updateUserInfo: builder.mutation({
      query: (data) => ({
        url: "user/update-user-info",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) dispatch(userUpdated(data.user));
        } catch (err) {
          console.error("❌ Profile update failed:", err);
        }
      },
    }),

    // 📸 Update Profile Picture
    updateProfilePicture: builder.mutation<any, { avatar: string }>({
      query: (body) => ({
        url: "user/update-profile-picture",
        method: "PUT",
        body,
        credentials: "include" as const,
        headers: { "Content-Type": "application/json" },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(userUpdated({ avatar: data.user.avatar }));
          }
        } catch (err: any) {
          console.error(
            "❌ Profile picture update failed:",
            JSON.stringify(err, null, 2)
          );
        }
      },
    }),

    // 📨 OTP while logged in
    sendOtpLoggedIn: builder.mutation({
      query: () => ({
        url: "auth/send-otp-loggedin",
        method: "POST",
      }),
    }),

    // 🔒 Reset Password (while logged in)
    resetPasswordLoggedIn: builder.mutation({
      query: (data) => ({
        url: "auth/reset-password-loggedin",
        method: "POST",
        body: data,
      }),
    }),

    // 🗑️ Delete Own Account (Logged in)
    deleteSelf: builder.mutation({
      query: (data) => ({
        url: "me/delete-confirm",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
});

// ✅ Export hooks
export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteByAdminMutation,
  useForgotPasswordMutation,
  useResetPasswordOtpMutation,
  useLogoutMutation,
  useDeleteAccountRequestMutation,
  useConfirmDeleteAccountMutation,
  useUpdateUserInfoMutation,
  useUpdateProfilePictureMutation,
  useSendOtpLoggedInMutation,
  useResetPasswordLoggedInMutation,
  useDeleteSelfMutation,
  useBlockUserMutation,
} = authApi;
