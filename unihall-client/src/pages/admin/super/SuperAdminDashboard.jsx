import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";
import { SkeletonBox } from "../../../components/ui/Skeleton";

const SUPER_ADMIN_TABS = [
  { path: "/admin/super", icon: "📊", label: "Dashboard" },
  { path: "/admin/super/universities", icon: "🏫", label: "Universities" },
  { path: "/admin/super/users", icon: "👤", label: "Users" },
];

const statCards = [
  {
    key: "totalUniversities",
    label: "Universities",
    icon: "🏫",
    color: "#0d9488",
  },
  { key: "totalHalls", label: "Total Halls", icon: "🏛️", color: "#6366f1" },
  {
    key: "totalStudents",
    label: "Total Students",
    icon: "🎓",
    color: "#3B82F6",
  },
  {
    key: "totalHallAdmins",
    label: "Hall Admins",
    icon: "🗝️",
    color: "#F59E0B",
  },
  {
    key: "totalUniversityAdmins",
    label: "University Admins",
    icon: "🧭",
    color: "#8B5CF6",
  },
];

const StatCardSkeleton = () => (
  <div
    style={{
      background: "white",
      borderRadius: "20px",
      padding: "22px",
      border: "1px solid rgba(0,0,0,0.04)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}
  >
    <SkeletonBox
      width="44px"
      height="44px"
      radius="14px"
      style={{ marginBottom: "16px" }}
    />
    <SkeletonBox height="12px" width="60%" style={{ marginBottom: "10px" }} />
    <SkeletonBox height="28px" width="40%" />
  </div>
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/super-admin/dashboard");
        setStats(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const summaryParts = stats
    ? [
        `${stats.totalUniversities ?? 0} ${stats.totalUniversities === 1 ? "university" : "universities"}`,
        `${stats.totalHalls ?? 0} ${stats.totalHalls === 1 ? "hall" : "halls"}`,
        `${stats.totalStudents ?? 0} ${stats.totalStudents === 1 ? "student" : "students"}`,
      ]
    : [];

  return (
    <AdminShell tabs={SUPER_ADMIN_TABS} title="Super Admin">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "24px",
          padding: "32px 28px",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-60px",
            top: "-60px",
            width: "220px",
            height: "220px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "20%",
            bottom: "-90px",
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "20px",
              padding: "4px 12px",
              color: "#a5b4fc",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              marginBottom: "16px",
            }}
          >
            ● PLATFORM OVERVIEW
          </div>

          {loading ? (
            <SkeletonBox height="30px" width="70%" />
          ) : (
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "white",
                lineHeight: 1.4,
                maxWidth: "640px",
              }}
            >
              Overseeing{" "}
              <span style={{ color: "#5eead4" }}>{summaryParts[0]}</span>,{" "}
              <span style={{ color: "#a5b4fc" }}>{summaryParts[1]}</span>, and{" "}
              <span style={{ color: "#93c5fd" }}>{summaryParts[2]}</span> across
              the UniHall network.
            </div>
          )}
        </div>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "18px",
          }}
        >
          {statCards.map((c) => (
            <StatCardSkeleton key={c.key} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "18px",
          }}
        >
          {statCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "22px",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                cursor: "default",
                transition: "box-shadow 0.2s",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background: `${card.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginBottom: "16px",
                }}
              >
                {card.icon}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                  marginBottom: "6px",
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  color: "#1F2D3D",
                  lineHeight: 1,
                }}
              >
                {stats?.[card.key] ?? 0}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
