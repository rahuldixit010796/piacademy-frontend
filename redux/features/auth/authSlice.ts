// client/redux/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: {
    public_id?: string;
    url?: string;
  };
  about?: string;
  className?: string;
  collegeName?: string;
  contact?: string;
  favoriteSubject?: string;
  dream?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },

    // ✅ Allow partial user updates (fix TypeScript error)
    userUpdated: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        // fallback if user isn't set yet
        state.user = action.payload as User;
      }
    },

    userLoggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { userLoggedIn, userUpdated, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
