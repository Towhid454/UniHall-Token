import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/layout/AppShell";

const modules = [
  {
    icon: "👤",
    label: "Student Profile",
    path: "/profile",
    gradient: "linear-gradient(135deg, #0d9488, #0f766e)",
    shadow: "rgba(13,148,136,0.35)",
  },
  {
    icon: "🍽️",
    label: "Today's Dining",
    path: "/dining/today",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    shadow: "rgba(245,158,11,0.35)",
  },
  {
    icon: "🥘",
    label: "Dining",
    path: "/dining",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    shadow: "rgba(239,68,68,0.35)",
  },
  {
    icon: "💰",
    label: "Hall Fee",
    path: "/hall-fee",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    shadow: "rgba(139,92,246,0.35)",
  },
  {
    icon: "🚪",
    label: "Room Allotment",
    path: "/room",
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    shadow: "rgba(249,115,22,0.35)",
  },
  {
    icon: "💳",
    label: "My Wallet",
    path: "/wallet",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    shadow: "rgba(16,185,129,0.35)",
  },
  {
    icon: "⭐",
    label: "Dining Review",
    path: "/dining/review",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    shadow: "rgba(6,182,212,0.35)",
  },
  {
    icon: "📣",
    label: "Hall Feedback",
    path: "/feedback",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    shadow: "rgba(236,72,153,0.35)",
  },
  {
    icon: "🎧",
    label: "Support/Help",
    path: "/support",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    shadow: "rgba(99,102,241,0.35)",
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppShell>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-40px",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "4px" }}
          >
            Welcome back 👋
          </div>
          <div style={{ color: "white", fontSize: "24px", fontWeight: "800" }}>
            {user?.name}
          </div>
          <div style={{ color: "#14b8a6", fontSize: "13px", marginTop: "4px" }}>
            {user?.hall?.name} • {user?.university?.shortName}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            { label: "Student ID", value: user?.studentId || "—", icon: "🪪" },
            { label: "Department", value: user?.department || "—", icon: "🏛️" },
            { label: "Session", value: user?.session || "—", icon: "📅" },
            { label: "Status", value: user?.status || "active", icon: "✅" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "14px 18px",
                textAlign: "center",
                minWidth: "90px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>
                {s.icon}
              </div>
              <div
                style={{ color: "white", fontWeight: "700", fontSize: "13px" }}
              >
                {s.value}
              </div>
              <div
                style={{ color: "#64748b", fontSize: "10px", marginTop: "2px" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Access */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "16px",
        }}
      >
        Quick Access
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "16px",
        }}
      >
        {modules.map((mod, i) => (
          <motion.button
            key={mod.path}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(mod.path)}
            style={{
              background: "white",
              border: "none",
              borderRadius: "20px",
              padding: "24px 12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: mod.gradient,
                borderRadius: "20px 20px 0 0",
              }}
            />
            <div
              style={{
                width: "56px",
                height: "56px",
                background: mod.gradient,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow: `0 6px 16px ${mod.shadow}`,
              }}
            >
              {mod.icon}
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#334155",
                textAlign: "center",
              }}
            >
              {mod.label}
            </span>
          </motion.button>
        ))}
      </div>
    </AppShell>
  );
};

export default DashboardPage;
