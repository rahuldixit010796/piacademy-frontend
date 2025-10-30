"use client";
import "react-pro-sidebar/dist/css/styles.css";

import { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";

import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  ExitToAppIcon,
} from "@/app/components/Admin/sidebar/Icon";

import avatarDefault from "@/public/default-avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

// ---- Classification (as confirmed) ----
const ADMIN_ONLY = new Set([
  "Users",            // /admin/users
  "Invoices",         // /admin/invoices
  "Manage Team",      // /admin/team
  "Users Analytics",  // /admin/users-analytics
  "Orders Analytics", // /admin/orders-analytics
  "Courses Analytics" // /admin/courses-analytics
]);

const INSTRUCTOR_ONLY = new Set([
  "Create Course",
  "Live Courses",
  "Hero",
  "FAQ",
  "Categories",
]);

const COMMON = new Set([
  "Dashboard",
  "Logout",
  "Home",  // <-- add this with same space

]);

// Map title -> instructor route OR /custom-page for admin-only
function routeForInstructor(title: string): string {
  if (COMMON.has(title)) {
    if (title === "Dashboard") return "/instructor/dashboard";
    if (title === "Logout") return "/";
     if (title === "Home") return "/";
  }
  if (INSTRUCTOR_ONLY.has(title)) {
    switch (title) {
      case "Create Course": return "/instructor/courses/new";
      case "Live Courses":  return "/instructor/courses";
      case "Hero":          return "/instructor/hero";
      case "FAQ":           return "/instructor/faq";
      case "Categories":    return "/instructor/categories";
    }
  }
  // Admin-only → send to /custom-page (as per your rule C)
  return "/custom-page";
}

interface ItemProps {
  title: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (title: string) => void;
}

const Item: FC<ItemProps> = ({ title, icon, selected, setSelected }) => {
  const to = routeForInstructor(title);
  return (
    <MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon}>
      <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
      <Link href={to} />
    </MenuItem>
  );
};

type Props = { open: boolean; setOpen: (o: boolean) => void };

const InstructorSidebar: FC<Props> = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"}`,
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item:hover": { color: "#868dfb !important" },
        "& .pro-menu-item.active": { color: "#6870fa !important" },
        "& .pro-inner-item": { padding: "5px 35px 5px 20px !important", opacity: 1 },
        "& .pro-menu-item": { color: `${theme !== "dark" && "#000"}` },
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <ProSidebar collapsed={isCollapsed} style={{ position: "fixed", left: 0, top: 0, bottom: 0 }}>
        <Menu iconShape="square">
          {/* Logo + Collapse */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{ margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Link href="/instructor/dashboard">
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    Pi-Academy
                  </h3>
                </Link>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User Info */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  src={user?.avatar?.url || avatarDefault}
                  style={{ cursor: "pointer", borderRadius: "50%", border: "3px solid #5b6fe6" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" className="!text-[20px] text-black dark:text-[#ffffffc1]" sx={{ m: "10px 0 0 0" }}>
                  {user?.name || "Instructor"}
                </Typography>
                <Typography variant="h6" className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize" sx={{ m: "10px 0 0 0" }}>
                  - {user?.role || "instructor"}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu (ALL items visible, with routing rules) */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Core */}
            <Item title="Dashboard" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />

            {/* Data */}
            {!isCollapsed && (
              <Typography variant="h5" sx={{ m: "15px 0 5px 25px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Data
              </Typography>
            )}
            <Item title="Users" icon={<GroupsIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Invoices" icon={<ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected} />

            {/* Content */}
            {!isCollapsed && (
              <Typography variant="h5" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Content
              </Typography>
            )}
            <Item title="Create Course" icon={<VideoCallIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Live Courses" icon={<OndemandVideoIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Hero" icon={<WebIcon />} selected={selected} setSelected={setSelected} />
            <Item title="FAQ" icon={<QuizIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Categories" icon={<WysiwygIcon />} selected={selected} setSelected={setSelected} />

            {/* Controllers */}
            {!isCollapsed && (
              <Typography variant="h5" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Controllers
              </Typography>
            )}
            <Item title="Manage Team" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />

            {/* Analytics */}
            {!isCollapsed && (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Analytics
              </Typography>
            )}
            <Item title="Courses Analytics" icon={<BarChartOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Orders Analytics" icon={<MapOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Users Analytics" icon={<ManageHistoryIcon />} selected={selected} setSelected={setSelected} />

            {/* Extras */}
            {!isCollapsed && (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Extras
              </Typography>
            )}
            <Item title="Home" icon={<ExitToAppIcon />} selected={selected} setSelected={setSelected} />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default InstructorSidebar;
