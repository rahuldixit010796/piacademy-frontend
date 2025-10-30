"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Policy from "./Policy";

type Props = {};

const Page = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState("Login");

  // ✅ Prevent hydration mismatch by delaying client-only UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // render empty div until client has mounted
    return <div />;
  }

  return (
    <div>
     
      <Policy />
    </div>
  );
};

export default Page;
