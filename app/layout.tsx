"use client";
import "./globals.css";
import { Poppins, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";
import Script from "next/script";
import Header from "../app/components/Header";
import { usePathname } from "next/navigation";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const pathname = usePathname(); // ✅ Check route

  useEffect(() => {
    setMounted(true);
    socketId.on("connection", () => {});
  }, []);

  const headerHeight = "80px";

  const isInstructorPage = pathname?.startsWith("/instructor");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} flex flex-col min-h-screen 
          bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black 
          transition-colors duration-500`}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {!mounted ? (
                <Loader />
              ) : (
                <>
                  {/* ✅ Show Header only if NOT /instructor */}
                  {!isInstructorPage && (
                    <div
                      style={{ height: headerHeight }}
                      className="fixed top-0 left-0 w-full z-50 bg-white/5 dark:bg-black/5 backdrop-blur-md border-b border-gray-200/10"
                    >
                      <Header
                        open={open}
                        setOpen={setOpen}
                        route={route}
                        setRoute={setRoute}
                        activeItem={0}
                      />
                    </div>
                  )}

                  {/* ✅ Adjust padding only if header exists */}
                  <main className={`${!isInstructorPage ? "pt-[80px]" : ""} flex-grow`}>
                    {children}
                  </main>
                </>
              )}

              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>

        {/* Google Identity Script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          async
          defer
          
        />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      </body>

    </html>
  );
}
