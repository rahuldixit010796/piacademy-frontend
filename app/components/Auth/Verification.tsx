"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { userLoggedIn } from "@/redux/features/auth/authSlice";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  onVerified?: () => void;
  onBack?: () => void;
};

const OTP_LENGTH = 5;

const Verification: React.FC<Props> = ({ onVerified, onBack }) => {
  const [activationFn, { isLoading }] = useActivationMutation();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // ✅ Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("activationToken");
    if (!token) {
      toast.error("Activation expired. Please register again.");
      router.push("/sign-up");
    }
  }, [router]);

  useEffect(() => {
    inputsRef.current?.[0]?.focus();
  }, []);

  useEffect(() => {
    setCanResend(false);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[idx] = value.slice(-1);
    setDigits(newDigits);
    if (value && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const submitOTP = async () => {
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter full 5-digit OTP.");
      return;
    }

    const token = localStorage.getItem("activationToken");
    if (!token) {
      toast.error("Activation expired. Please register again.");
      router.push("/sign-up");
      return;
    }

    try {
      const res: any = await activationFn({
        activation_token: token,
        activation_code: code,
      }).unwrap();

      toast.success("Account verified!");
      dispatch(userLoggedIn({ user: res.user, accessToken: res.accessToken }));
      localStorage.removeItem("activationToken");
      router.push("/");
      onVerified?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
          <input
            key={idx}
ref={(el) => {
  inputsRef.current[idx] = el;
}}            value={digits[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            maxLength={1}
            className="w-[46px] h-[46px] text-center rounded border bg-transparent outline-none"
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <button onClick={submitOTP} className={`${styles.button}`} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </button>

        <button onClick={() => onBack?.()} className="px-4 py-2 rounded border">
          Back
        </button>
      </div>
    </div>
  );
};

export default Verification;
