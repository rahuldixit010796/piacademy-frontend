"use client";
import Link from "next/link";
import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import { HiOutlineUserCircle } from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";
import Image from "next/image";
import avatarFallback from "../../public/default-avatar.png";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSession } from "next-auth/react";
import {
  useSocialAuthMutation,
  useLogoutMutation,
  useDeleteSelfMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import ForgotPassword from "../components/Auth/ForgotPassword";
import DeleteAccountModal from "../components/Auth/DeleteAccountModal";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/features/store";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import { usePathname } from "next/navigation";
import ChangePassword from "@/app/components/Auth/ChangePassword";
import ReferFriendModal from "@/app/components/ReferFriendModal"; // ✅ NEW
import { useRouter } from "next/navigation";
import { TeachOnPiButton } from "@/app/components/TeachOnPiButton";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const SUPER_ADMIN_EMAIL = "rahuldixit010796@gmail.com";

const Header: FC<Props> = ({ open, setOpen, route, setRoute }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isReferOpen, setIsReferOpen] = useState<boolean>(false); // ✅ NEW

  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  const { data: userData, isLoading, refetch } = useLoadUserQuery(undefined, {});
  const { data } = useSession();
  const [socialAuth, { isSuccess }] = useSocialAuthMutation();
  const [logoutUser, { isLoading: logoutLoading }] = useLogoutMutation();
  const [deleteSelf] = useDeleteSelfMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const pathname = usePathname();

  // ✅ Lock background scroll when sidebar opens
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  // 🧹 Logout
  const handleLogout = async () => {
    try {
      await logoutUser(undefined).unwrap();
      toast.success("Logged out successfully");
    } catch (err: unknown) {
      console.warn("Server logout failed:", err);
    } finally {
      dispatch(userLoggedOut());
      setDropdownOpen(false);
      window.location.href = "/";
    }
  };

  const avatarSrc =
    user?.avatar?.url ||
    (typeof userData?.user?.avatar === "string"
      ? userData.user.avatar
      : userData?.user?.avatar?.url) ||
    "/default-avatar.png";

  // 🧠 Handle outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownOpen) return;
      const wrap = dropdownRef.current;
      if (wrap && wrap.contains(e.target as Node)) return;
setDropdownOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [dropdownOpen]);

  // 🧭 Keyboard navigation
  const onAvatarKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setDropdownOpen((p) => !p);
    }
    if (e.key === "Escape") {
      setDropdownOpen(false);
      avatarBtnRef.current?.focus();
    }
  }, []);

  // 🧹 Account deletion
  const handleDeleteAccount = async () => {
    const username = prompt("Enter your username to confirm:");
    const password = prompt("Enter your password:");
    const confirmPassword = prompt("Re-enter your password:");
    const otp = prompt("Enter OTP sent to your email:");
    if (!username || !password || !confirmPassword || !otp) {
      toast.error("All fields are required to delete account.");
      return;
    }
    try {
      await deleteSelf({ username, password, confirmPassword, otp }).unwrap();
      toast.success("Your account has been deleted");
      window.location.href = "/";
    } catch (err: unknown) {
      toast.error("Account deletion failed");
    }
  };
const router = useRouter();

  const openLogin = () => {
    setRoute("Login");
    setOpen(true);
    setDropdownOpen(false);
  };
  const openSignup = () => {
    setRoute("Sign-Up");
    setOpen(true);
    setDropdownOpen(false);
  };

  // 🧠 Auto social auth hydration
   useEffect(() => {
    if (!isLoading) {
      if (!userData && data) {
        socialAuth({
          email: (data.user as { email?: string })?.email,
          name: (data.user as { name?: string })?.name,
          avatar: (data.user as { image?: string })?.image,
        });
        refetch();
      }
      if (data === null && isSuccess) {
        toast.success("Login Successfully");
      }
    }
   }, [data, userData, isLoading, socialAuth, refetch, isSuccess]);

  return (
    <div className="w-full relative">
      {/* Fixed header (no flicker) */}
      <div className="fixed top-0 left-0 w-full h-[80px] z-[100] border-b dark:border-[#ffffff1c] bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black shadow-md transition-all duration-500">
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <button
                className="flex 800px:hidden items-center justify-center rounded-md p-2 focus:outline-none focus:ring focus:ring-indigo-500"
                aria-label="Open navigation menu"
                onClick={() => setMobileOpen(true)}
              >
                <RxHamburgerMenu className="text-2xl text-black dark:text-white" />
              </button>

              <Link
                href={"/"}
                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
              >
                PI-Academy
              </Link>
            </div>

            {/* Right: Desktop nav */}
            <div className="hidden 800px:flex items-center justify-center gap-5 flex-1">
              {[
                { href: "/", label: "Home" },
                { href: "/courses", label: "Courses" },
                { href: "/about", label: "About" },
                { href: "/policy", label: "Policy" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 pb-[2px]"
                      : "text-gray-700 dark:text-gray-200 hover:text-blue-500"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className={`text-base font-medium transition-colors duration-200 ${
                    pathname === "/admin"
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-[2px]"
                      : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  }`}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* ThemeSwitcher + Avatar */}
            <div className="flex items-center gap-3 ml-auto z-50">
              <ThemeSwitcher />
              <div ref={dropdownRef} className="relative z-[999]">
                {user ? (
                  <>
                    <button
                      ref={avatarBtnRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={dropdownOpen}
                      aria-label="User menu"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      onKeyDown={onAvatarKeyDown}
                      className="rounded-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Image
                        src={avatarSrc || avatarFallback}
                        alt="avatar"
                        width={35}
                        height={35}
                        className="h-[35px] w-[35px] rounded-full object-cover"
                        priority
                      />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* My Courses */}
                        <Link
                          href="/my-courses"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          📚 My Courses
                        </Link>

                        {/* Teach on Pi Academy */}
                      {isSuperAdmin ? (
  <Link
    href="/admin"
    onClick={() => setDropdownOpen(false)}
    className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    🛠 Admin Dashboard
  </Link>
) : (
<button
  onClick={async () => {
    setDropdownOpen(false);

    if (!user) {
      setRoute("Login");
      setOpen(true);
      return;
    }

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${API}/user/instructor/status`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data?.submitted) {
        router.push("/instructor/dashboard");
      } else {
        try { localStorage.removeItem("visitedTeachLanding"); } catch {}
        router.push("/teach-on-pi");
      }
    } catch {
      router.push("/teach-on-pi");
    }
  }}
  className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
>
  👨‍🏫 Teach on Pi Academy
</button>

)}

                        {/* Refer your friend (modal) */}
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setIsReferOpen(true);
                          }}
                          className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          🤝 Refer your friend
                        </button>

                        {/* About Me */}
                        <Link
                          href="/about-me"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          🧾 About Me
                        </Link>

                        {/* Reset Password */}
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            setIsChangePasswordOpen(true);
                          }}
                          className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          🔑 Reset Password
                        </button>

                        {/* Delete My Account — hidden for SUPER ADMIN only */}
                        {user?.email !== SUPER_ADMIN_EMAIL && (
                          <button
                            onClick={handleDeleteAccount}
                            className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            🗑️ Delete My Account
                          </button>
                        )}

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="block w-full px-4 py-2 text-left text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {logoutLoading ? "Logging out..." : "🚪 Logout"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <HiOutlineUserCircle
                      size={28}
                      className="cursor-pointer dark:text-white text-black"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      onKeyDown={onAvatarKeyDown}
                      tabIndex={0}
                    />

                    {!user && dropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem("signupRole", "student");
                            openLogin();
                          }}
                          className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          🎓 Sign In / Sign Up 
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Auth Modals ===== */}
      {route === "Login" && open && (
        <CustomModal open={open} setOpen={setOpen}>
          <Login setRoute={setRoute} setOpen={setOpen} />
        </CustomModal>
      )}
      {route === "Sign-Up" && open && (
        <CustomModal open={open} setOpen={setOpen}>
          <SignUp setRoute={setRoute} setOpen={setOpen} />
        </CustomModal>
      )}
      {route === "Verification" && open && (
        <CustomModal open={open} setOpen={setOpen}>
          <Verification onBack={() => setRoute("Sign-Up")} onVerified={() => setOpen(false)} />
        </CustomModal>
      )}
      {route === "DeleteAccount" && open && (
        <CustomModal open={open} setOpen={setOpen}>
          <DeleteAccountModal setOpen={setOpen} />
        </CustomModal>
      )}
      {route === "ResetPassword" && open && (
        <CustomModal open={open} setOpen={setOpen}>
          <ForgotPassword setOpen={setOpen} />
        </CustomModal>
      )}

      {/* Reset Password quick access */}
      {isChangePasswordOpen && (
        <CustomModal open={isChangePasswordOpen} setOpen={setIsChangePasswordOpen}>
          <ForgotPassword setOpen={setIsChangePasswordOpen} />
        </CustomModal>
      )}

      {/* ✅ Refer Friend Modal mount */}
      {isReferOpen && <ReferFriendModal open={isReferOpen} setOpen={setIsReferOpen} />}
    </div>
  );
};

export default Header;
