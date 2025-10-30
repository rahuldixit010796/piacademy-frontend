"use client";
import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import GoogleIcon from "@mui/icons-material/Google";

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLoginButton: React.FC = () => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleLogin,
      });
    }
  }, []);

  const handleGoogleLogin = async (response: any) => {
    try {
      const userInfo = jwtDecode(response.credential) as {
        email: string;
        name: string;
        picture: string;
      };

      // Call backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/social-auth`,
        {
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
        },
        { withCredentials: true }
      );

      toast.success("Logged in with Google!");
      console.log("Google login success:", res.data);
    } catch (err: any) {
      toast.error("Google login failed");
      console.error(err);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (window.google && window.google.accounts.id) {
          window.google.accounts.id.prompt(); // trigger popup
        } else {
          toast.error("Google API not loaded. Please try again.");
        }
      }}
      className="w-full flex items-center justify-center border rounded-lg py-2 hover:bg-gray-100 transition-colors"
    >
      <GoogleIcon className="mr-2" />
      Sign In & Sign Up with Google
    </button>
  );
};

export default GoogleLoginButton;
