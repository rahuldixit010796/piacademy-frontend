"use client";

import React, { useState } from "react";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import GoogleLoginButton from "./GoogleLoginButton";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: () => void;
};

const SignUp: React.FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [registerFn] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ ENTER should act like TAB (move to next input)
function focusNextInput(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") {
    const form = e.currentTarget.form;
    if (!form) return;
    const index = Array.prototype.indexOf.call(form, e.currentTarget);

    // if not last field → move to next
    if (index < form.elements.length - 1) {
      e.preventDefault();
      const next = form.elements[index + 1] as HTMLElement | null;
      next?.focus();
    }
    // if last field → do nothing → allow Enter to submit
  }
}

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]*$/, "Enter a valid phone number")
        .required("Phone is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const role =
          typeof window !== "undefined" &&
          localStorage.getItem("signupRole") === "instructor"
            ? "instructor"
            : "student";

        const res: any = await registerFn({ ...values, role }).unwrap();

        if (res?.activationToken) {
          localStorage.setItem("activationToken", res.activationToken);
        } else {
          toast.error("Activation token missing. Please register again.");
          return;
        }

        try {
          localStorage.removeItem("signupRole");
        } catch {}

        toast.success("OTP sent to your email!");
        setRoute("Verification");
      } catch (err: any) {
        toast.error(err?.data?.message || "Registration failed");
      }
    },
  });

  return (
    <div className="w-[90%] max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Create your account
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onKeyDown={focusNextInput}
          value={formik.values.name}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black"
        />

        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          onKeyDown={focusNextInput}
          value={formik.values.email}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black"
        />

        <input
          type="text"
          name="phone"
          placeholder="10 digit mobile"
          onKeyDown={focusNextInput}
          value={formik.values.phone}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Minimum 6 characters"
            onKeyDown={focusNextInput}
            value={formik.values.password}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Retype password"
            onKeyDown={focusNextInput}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <span
          onClick={() => setRoute("Login")}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <GoogleLoginButton />
    </div>
  );
};

export default SignUp;
