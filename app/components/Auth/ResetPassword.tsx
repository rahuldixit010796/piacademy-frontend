"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useResetPasswordOtpMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPassword = ({ email, setOpen }: { email: string; setOpen: (o: boolean) => void }) => {
  const [resetPasswordOtp, { isLoading }] = useResetPasswordOtpMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: { otp: "", password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP required"),
      password: Yup.string().min(6, "At least 6 chars").required("Password required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
      await resetPasswordOtp({
  email,
  code: values.otp,          // ✅ renamed "otp" → "code"
  password: values.password, // ✅ renamed "newPassword" → "password"
}).unwrap();
        toast.success("Password reset successfully! Please login again.");
        setOpen(false);
      } catch (err: any) {
        toast.error(err?.data?.message || "Reset failed");
      }
    },
  });

  return (
    <div className="p-6 md:w-[420px]">
      <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* OTP */}
        <input
          name="otp"
          placeholder="Enter OTP"
          value={formik.values.otp}
          onChange={formik.handleChange}
          className={styles.input}
        />
        {formik.errors.otp && <p className="text-red-500">{formik.errors.otp}</p>}

        {/* New Password */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            className={styles.input}
            placeholder="Enter new password"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEye size={18}/> : <AiOutlineEyeInvisible size={18}/>}
          </span>
        </div>
        {formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}

        {/* Confirm Password */}
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            className={styles.input}
            placeholder="Confirm new password"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiOutlineEye size={18}/> : <AiOutlineEyeInvisible size={18}/>}
          </span>
        </div>
        {formik.errors.confirmPassword && <p className="text-red-500">{formik.errors.confirmPassword}</p>}

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
