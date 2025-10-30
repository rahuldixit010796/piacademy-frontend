"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { userLoggedIn } from "@/redux/features/auth/authSlice";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: () => void;
};

const Login: React.FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [login] = useLoginMutation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email required"),
      password: Yup.string().min(6, "At least 6 chars").required("Password required"),
    }),
    onSubmit: async (values) => {
      try {
        const res: any = await login({
          email: values.email.toLowerCase(),
          password: values.password,
        }).unwrap();

        // ✅ update Redux auth state
        dispatch(
          userLoggedIn({
            accessToken: res?.accessToken,
            user: res?.user,
          })
        );

        toast.success(res?.message || "Login successful");
        setLoginError(null);

        if (refetch) refetch();
        setOpen(false);
      } catch (err: any) {
  const message = err?.data?.message || err?.message || "Login failed";
  toast.error(message);
  setLoginError(message); // will be "User not found" OR "Invalid password"
}
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Login</h2>

      {/* Email */}
      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
            onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // stop Formik from submitting
        const next = document.querySelector<HTMLInputElement>('input[name="password"]');
        next?.focus();
      }
    }}
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label>Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye size={25} /> : <AiOutlineEyeInvisible size={25} />}
          </button>
        </div>
        {formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}
      </div>

      <button type="submit" className={styles.button}>
        Login
      </button>

      {/* Forgot Password */}
    {loginError && loginError.toLowerCase().includes("password") && (
  <p
    onClick={() => {
      setRoute("ResetPassword"); // open OTP flow modal
      setOpen(true);
    }}
    className="text-blue-600 cursor-pointer text-sm mt-2"
  >
    Forgot password?
  </p>
)}

      {/* Switch to Sign Up */}
      <p
        onClick={() => {
          setRoute("Sign-Up");
          setOpen(true);
        }}
        className="text-blue-600 cursor-pointer text-sm mt-2"
      >
        Don’t have an account? Sign Up
      </p>
    </form>
  );
};

export default Login;
