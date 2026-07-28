import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";

const UNIVERSITY_ADMIN_TABS = [
  { path: "/admin/university", icon: "📊", label: "Dashboard" },
  { path: "/admin/university/halls", icon: "🏛️", label: "Halls" },
  { path: "/admin/university/report", icon: "📈", label: "Cross-Hall Report" },
];

const statCards = [
  { key: "totalHalls", label: "Total Halls", color: "#0d9488" },
  { key: "totalStudents", label: "Total Students", color: "#6366f1" },
  { key: "totalHallAdmins", label: "Hall Admins", color: "#3B6FE0" },
  { key: "pendingAllotments", label: "Pending Allotments", color: "#F4B400" },
  { key: "pendingTickets", label: "Pending Tickets", color: "#E74C3C" },
];

export default function UniversityAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/university-admin/dashboard");
        setStats(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminShell tabs={UNIVERSITY_ADMIN_TABS} title="University Admin">
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#1F2D3D",
          marginBottom: "20px",
        }}
      >
        University Admin Dashboard
      </h1>

      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {statCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: "20px",
                borderTop: `4px solid ${card.color}`,
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "6px",
                }}
              >
                {card.label}
              </div>
              <div
                style={{ fontSize: "28px", fontWeight: 700, color: "#1F2D3D" }}
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
