"use client";

import React, { useState } from "react";
import { useSendOtpLoggedInMutation, useResetPasswordLoggedInMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePassword = ({ setOpen }: { setOpen: (o: boolean) => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [sendOtpLoggedIn, { isLoading: sending }] = useSendOtpLoggedInMutation();
  const [resetPasswordLoggedIn, { isLoading: resetting }] = useResetPasswordLoggedInMutation();

  const handleSendOtp = async () => {
    try {
      await sendOtpLoggedIn({}).unwrap();
      toast.success("OTP sent to your registered email!");
      setStep(2);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPasswordLoggedIn({
        otp,
        currentPassword,
        newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="p-6 md:w-[420px]">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {step === 1 ? "Verify OTP" : "Reset Password"}
      </h2>

      {step === 1 ? (
        <>
          <p className="text-gray-600 mb-3 text-center">
            Click below to receive OTP in your registered email.
          </p>
          <button
            onClick={handleSendOtp}
            className={styles.button}
            disabled={sending}
          >
            {sending ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      ) : (
        <form className="space-y-4">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />

          <input
            placeholder="Confirm New Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
          />

          <button
            type="button"
            onClick={handleResetPassword}
            className={styles.button}
            disabled={resetting}
          >
            {resetting ? "Updating..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
