"use client";
import React, { FC, useState, useEffect } from "react";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ/FAQ";

const Page: FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

 return (
  <div className="flex flex-col min-h-screen">
    <Hero />
    <Courses />
    <Reviews />
    <FAQ />

    {/* ✅ Footer section integrated directly on home page */}
    <footer
      className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg
      text-gray-600 dark:text-gray-300 border-t border-gray-300 dark:border-gray-700
      mt-10 py-10"
    >
      <div className="w-[95%] md:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 min-[900px]:grid-cols-4 gap-x-6 gap-y-10 auto-rows-fr">

          {/* About */}
          <div className="space-y-2">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">About</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:underline">Our Story</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/courses" className="hover:underline">Courses</a></li>
              <li><a href="/profile" className="hover:underline">My Account</a></li>
              <li><a href="/course-dashboard" className="hover:underline">Course Dashboard</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Social Links</h3>
            <ul className="space-y-2">
              <li><a href="https://youtube.com/@PIAcademy3?si=2HUuzM_8p5bzzp_i" className="hover:underline">YouTube</a></li>
              <li><a href="https://instagram.com/pi_academy12?igshid=YTQwZjQ0NmI0OA==" className="hover:underline">Instagram</a></li>
              <li><a href="https://www.facebook.com/PiAcademy1/" className="hover:underline">Facebook</a></li>
              <li><a href="https://wa.me/message/ZOWU5X24JHERG1" className="hover:underline">WhatsApp</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">Contact Info</h3>
            <p><a href="tel:+918073387567" className="hover:underline">📞 +91 8073387567</a></p>
            <p><a href="mailto:rahuldixit010796@gmail.com" className="hover:underline">✉️ rahuldixit010796@gmail.com</a></p>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-gray-300 dark:border-gray-800 mt-6 mb-2 opacity-40" />
        <p className="text-center text-sm text-gray-800 dark:text-gray-200">
          Copyright © {new Date().getFullYear()} PI-Academy | All Rights Reserved
        </p>
      </div>
    </footer>
  </div>
);

};

export default Page;
