"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/features/store";
import { Box, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Stats {
  users: number;
  courses: number;
  orders: number;
  revenue: number;
}

const DashboardHero = ({ isDashboard }: { isDashboard?: boolean }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [stats, setStats] = useState<Stats>({
    users: 0,
    courses: 0,
    orders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes, ordersRes, revenueRes] = await Promise.all([
          fetch("/api/admin/stats/users").then((r) => r.json()),
          fetch("/api/admin/stats/courses").then((r) => r.json()),
          fetch("/api/admin/stats/orders").then((r) => r.json()),
          fetch("/api/admin/stats/revenue").then((r) => r.json()),
        ]);

        setStats({
          users: usersRes.count || 0,
          courses: coursesRes.count || 0,
          orders: ordersRes.count || 0,
          revenue: revenueRes.total || 0,
        });
      } catch (err) {
        console.error("❌ Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Simple chart (later you can replace with monthly breakdown)
  const chartData = [
    { name: "Stats", users: stats.users, courses: stats.courses, orders: stats.orders },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Message */}
      <h1 className="text-2xl font-bold dark:text-white">
        Welcome back, {user?.name || "Admin"} 👋
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Box className="rounded-2xl shadow-md">
          <Paper className="p-4 text-center">
            <h2 className="text-lg font-semibold">👥 Users</h2>
            <p className="text-2xl font-bold">{loading ? "…" : stats.users}</p>
          </Paper>
        </Box>

        <Box className="rounded-2xl shadow-md">
          <Paper className="p-4 text-center">
            <h2 className="text-lg font-semibold">🎓 Courses</h2>
            <p className="text-2xl font-bold">{loading ? "…" : stats.courses}</p>
          </Paper>
        </Box>

        <Box className="rounded-2xl shadow-md">
          <Paper className="p-4 text-center">
            <h2 className="text-lg font-semibold">📦 Orders</h2>
            <p className="text-2xl font-bold">{loading ? "…" : stats.orders}</p>
          </Paper>
        </Box>

        <Box className="rounded-2xl shadow-md">
          <Paper className="p-4 text-center">
            <h2 className="text-lg font-semibold">💰 Revenue</h2>
            <p className="text-2xl font-bold">
              {loading ? "…" : `₹${stats.revenue.toLocaleString()}`}
            </p>
          </Paper>
        </Box>
      </div>

      {/* Analytics Chart */}
      <Box className="rounded-2xl shadow-md">
        <Paper className="p-6">
          <h2 className="text-lg font-semibold mb-4">📊 User, Courses & Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#4F46E5" />
              <Bar dataKey="courses" fill="#10B981" />
              <Bar dataKey="orders" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </div>
  );
};

export default DashboardHero;
