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
} from "./Icon";

import avatarDefault from "../../../../public/default-avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (title: string) => void;
}

const Item: FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => (
  <MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon}>
    <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
    <Link href={to} />
  </MenuItem>
);

const AdminSidebar: FC = () => {
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
                <Link href="/admin">
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
                  {user?.name}
                </Typography>
                <Typography variant="h6" className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize" sx={{ m: "10px 0 0 0" }}>
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu (ALL items for Admin) */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Core */}
            <Item title="Dashboard" to="/admin" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />

            {/* Data */}
            {!isCollapsed && (
              <Typography variant="h5" sx={{ m: "15px 0 5px 25px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Data
              </Typography>
            )}
            <Item title="Users" to="/admin/users" icon={<GroupsIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Invoices" to="/admin/invoices" icon={<ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected} />

            {/* Content */}
            {!isCollapsed && (
              <Typography variant="h5" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Content
              </Typography>
            )}
            <Item title="Create Course" to="/admin/create-course" icon={<VideoCallIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Live Courses" to="/admin/courses" icon={<OndemandVideoIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Hero" to="/admin/hero" icon={<WebIcon />} selected={selected} setSelected={setSelected} />
            <Item title="FAQ" to="/admin/faq" icon={<QuizIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Categories" to="/admin/categories" icon={<WysiwygIcon />} selected={selected} setSelected={setSelected} />

            {/* Controllers */}
            {!isCollapsed && (
              <Typography variant="h5" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Controllers
              </Typography>
            )}
            <Item title="Manage Team" to="/admin/team" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />

            {/* Analytics */}
            {!isCollapsed && (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Analytics
              </Typography>
            )}
            <Item title="Courses Analytics" to="/admin/courses-analytics" icon={<BarChartOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Orders Analytics" to="/admin/orders-analytics" icon={<MapOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Users Analytics" to="/admin/users-analytics" icon={<ManageHistoryIcon />} selected={selected} setSelected={setSelected} />

            {/* Extras */}
            {!isCollapsed && (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }} className="!text-[18px] dark:text-[#ffffffc1]">
                Extras
              </Typography>
            )}
            <Item title="Logout" to="/" icon={<ExitToAppIcon />} selected={selected} setSelected={setSelected} />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;
