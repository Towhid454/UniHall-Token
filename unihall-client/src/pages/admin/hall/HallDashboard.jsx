import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AdminShell from "../../../components/layout/AdminShell";
import api from "../../../api/axios";

const HallDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/hall-admin/dashboard")
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats
    ? [
        {
          label: "Total Students",
          value: stats.totalStudents,
          icon: "👥",
          color: "#0d9488",
          bg: "rgba(13,148,136,0.1)",
          path: "/admin/hall/students",
        },
        {
          label: "Total Rooms",
          value: stats.totalRooms,
          icon: "🚪",
          color: "#6366f1",
          bg: "rgba(99,102,241,0.1)",
          path: "/admin/hall/rooms",
        },
        {
          label: "Pending Allotments",
          value: stats.pendingAllotments,
          icon: "⏳",
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.1)",
          path: "/admin/hall/allotments",
        },
        {
          label: "Pending Tickets",
          value: stats.pendingTickets,
          icon: "🎧",
          color: "#ef4444",
          bg: "rgba(239,68,68,0.1)",
          path: "/admin/hall/tickets",
        },
        {
          label: "Dining Plans",
          value: stats.totalDiningPlans,
          icon: "🍽️",
          color: "#10b981",
          bg: "rgba(16,185,129,0.1)",
          path: "/admin/hall/dining",
        },
      ]
    : [];

  const QUICK_ACTIONS = [
    {
      label: "Review Allotments",
      icon: "🚪",
      path: "/admin/hall/allotments",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      label: "Manage Students",
      icon: "👥",
      path: "/admin/hall/students",
      color: "#0d9488",
      gradient: "linear-gradient(135deg, #0d9488, #0f766e)",
    },
    {
      label: "Manage Rooms",
      icon: "🛏️",
      path: "/admin/hall/rooms",
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    },
    {
      label: "Dining Plans",
      icon: "🍽️",
      path: "/admin/hall/dining",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      label: "Support Tickets",
      icon: "🎧",
      path: "/admin/hall/tickets",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    },
  ];

  return (
    <AdminShell>
      <div>
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "16px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-20px",
              top: "-20px",
              width: "100px",
              height: "100px",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>
              Hall Admin Panel
            </div>
            <div
              style={{
                color: "white",
                fontSize: "17px",
                fontWeight: "700",
                marginTop: "4px",
              }}
            >
              Manage your hall 🏢
            </div>
            {stats?.pendingAllotments > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  color: "#fbbf24",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                ⚠️ {stats.pendingAllotments} room allotment
                {stats.pendingAllotments > 1 ? "s" : ""} awaiting review
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #e2e8f0",
                borderTop: "3px solid #6366f1",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {STAT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => card.path && navigate(card.path)}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  cursor: card.path ? "pointer" : "default",
                  border: "1px solid rgba(0,0,0,0.05)",
                  gridColumn: i === 4 ? "span 2" : "span 1",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "900",
                        color: card.color,
                      }}
                    >
                      {card.value}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      {card.label}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: card.bg,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "12px",
          }}
        >
          Quick Actions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(action.path)}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "white",
                border: "none",
                borderRadius: "16px",
                padding: "16px",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: action.gradient,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                {action.icon}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminShell>
  );
};

export default HallDashboard;
