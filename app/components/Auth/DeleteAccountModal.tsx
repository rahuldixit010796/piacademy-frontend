"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  useDeleteAccountRequestMutation, 
  useConfirmDeleteAccountMutation 
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";

const DeleteAccountModal = ({ setOpen }: { setOpen: (o: boolean) => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [deleteAccountRequest] = useDeleteAccountRequestMutation();
  const [confirmDeleteAccount, { isLoading }] = useConfirmDeleteAccountMutation();

  // Step 1: request OTP
  const requestOtp = async () => {
    try {
      await deleteAccountRequest(undefined).unwrap();
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2: confirm deletion
  const formik = useFormik({
    initialValues: { username: "", password: "", confirmPassword: "", otp: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Username required"),
      password: Yup.string().required("Password required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
      otp: Yup.string().required("OTP required"),
    }),
    onSubmit: async (values) => {
      try {
        await confirmDeleteAccount({
          username: values.username,
          password: values.password,
          otp: values.otp,
        }).unwrap();
        toast.success("Account deleted successfully");
        setOpen(false);
      } catch (err: any) {
        toast.error(err?.data?.message || "Delete failed");
      }
    },
  });

  return (
    <div className="p-6 md:w-[420px]">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Delete Account
      </h2>

      {step === 1 ? (
        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            Click below to request an OTP to your email before account deletion.
          </p>
          <button onClick={requestOtp} className={styles.button}>
            Request OTP
          </button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Enter username"
            value={formik.values.username}
            onChange={formik.handleChange}
            className={styles.input}
          />
          {formik.errors.username && (
            <p className="text-red-500">{formik.errors.username}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className={styles.input}
          />
          {formik.errors.password && (
            <p className="text-red-500">{formik.errors.password}</p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            className={styles.input}
          />
          {formik.errors.confirmPassword && (
            <p className="text-red-500">{formik.errors.confirmPassword}</p>
          )}

          <input
            name="otp"
            placeholder="Enter OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
            className={styles.input}
          />
          {formik.errors.otp && (
            <p className="text-red-500">{formik.errors.otp}</p>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Account"}
          </button>
        </form>
      )}
    </div>
  );
};

export default DeleteAccountModal;
