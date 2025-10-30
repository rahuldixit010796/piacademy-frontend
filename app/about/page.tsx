"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import About from "./About";
type Props = {};

const Page = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(2);
  const [route, setRoute] = useState("Login");

  // ✅ Prevent hydration mismatch by only rendering client-side UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  
  return (
    <div>
     
      <About />
    </div>
  );
};

export default Page;
