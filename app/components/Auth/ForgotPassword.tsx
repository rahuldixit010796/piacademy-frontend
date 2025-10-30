"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import ResetPassword from "./ResetPassword";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";

const ForgotPassword = ({ setOpen }: { setOpen: (o: boolean) => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [forgotPassword] = useForgotPasswordMutation();

  // Step 1: Ask for email
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email required"),
    }),
    onSubmit: async (values) => {
      try {
        await forgotPassword({ email: values.email }).unwrap();
        toast.success("OTP sent to your email");
        setEmail(values.email);
        setStep(2); // go to ResetPassword form
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to send OTP");
      }
    },
  });

  if (step === 2) {
    // Move to ResetPassword.tsx after OTP is sent
    return <ResetPassword email={email} setOpen={setOpen} />;
  }

  return (
    <div className="p-6 md:w-[420px]">
      <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          className={styles.input}
        />
        {formik.errors.email && (
          <p className="text-red-500">{formik.errors.email}</p>
        )}
        <button type="submit" className={styles.button}>
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
