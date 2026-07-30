import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/layout/AppShell";

const modules = [
  {
    icon: "👤",
    label: "Student Profile",
    path: "/profile",
    accent: "#0d9488",
  },
  {
    icon: "🍽️",
    label: "Today's Dining",
    path: "/dining/today",
    accent: "#f59e0b",
  },
  {
    icon: "🥘",
    label: "Dining",
    path: "/dining",
    accent: "#ef4444",
  },
  {
    icon: "💰",
    label: "Hall Fee",
    path: "/hall-fee",
    accent: "#8b5cf6",
  },
  {
    icon: "🚪",
    label: "Room Allotment",
    path: "/room",
    accent: "#f97316",
  },
  {
    icon: "💳",
    label: "My Wallet",
    path: "/wallet",
    accent: "#10b981",
  },
  {
    icon: "⭐",
    label: "Dining Review",
    path: "/dining/review",
    accent: "#06b6d4",
  },
  {
    icon: "📣",
    label: "Hall Feedback",
    path: "/feedback",
    accent: "#ec4899",
  },
  {
    icon: "🎧",
    label: "Support/Help",
    path: "/support",
    accent: "#6366f1",
  },
];

const statIcons = {
  "Student ID": "🆔",
  Department: "📚",
  Session: "📅",
  Status: "📌",
};

const statColors = {
  "Student ID": "#0d9488",
  Department: "#6366f1",
  Session: "#f59e0b",
  Status: "#22c55e",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { label: "Student ID", value: user?.studentId || "—" },
    { label: "Department", value: user?.department || "—" },
    { label: "Session", value: user?.session || "—" },
    { label: "Status", value: (user?.status || "active").toUpperCase() },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#22c55e";
      case "inactive":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  return (
    <AppShell>
      {/* Hero Banner - clean, focused */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(145deg, #0b1120 0%, #1a2332 100%)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "24px",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "2px",
            }}
          >
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </div>
          <div
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "-0.3px",
            }}
          >
            {user?.hall?.name || "Your Hall"}
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            padding: "6px 16px",
            borderRadius: "30px",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#cbd5e1",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
      </motion.div>

      {/* Stats Row - Modern metric cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "18px 20px",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: `${statColors[stat.label]}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
                color: statColors[stat.label],
              }}
            >
              {statIcons[stat.label]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  color: "#0f172a",
                  fontSize: "16px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {stat.label === "Status" ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: getStatusColor(stat.value),
                        boxShadow: `0 0 0 2px ${getStatusColor(stat.value)}25`,
                        animation: "pulse-dot 2s ease-in-out infinite",
                      }}
                    />
                    {stat.value}
                  </>
                ) : (
                  stat.value
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Access */}
      <div
        style={{
          fontSize: "17px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "16px",
          letterSpacing: "-0.2px",
        }}
      >
        Quick Access
      </div>

      {/* Modules Grid - Clean, modern, 4-col friendly */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
          gap: "16px",
        }}
      >
        {modules.map((mod, i) => (
          <motion.button
            key={mod.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.015, duration: 0.25 }}
            whileHover={{
              y: -6,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(mod.path)}
            style={{
              background: "white",
              border: "1px solid #f1f5f9",
              borderRadius: "16px",
              padding: "22px 10px 18px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 12px 32px -8px rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = mod.accent + "40";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.02)";
              e.currentTarget.style.borderColor = "#f1f5f9";
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: `${mod.accent}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                color: mod.accent,
                transition: "transform 0.2s ease",
              }}
            >
              {mod.icon}
            </div>
            <span
              style={{
                fontSize: "13.5px",
                fontWeight: "600",
                color: "#1e293b",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {mod.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Pulse animation for status dot */}
      <style>
        {`
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.85); }
          }
        `}
      </style>
    </AppShell>
  );
};

export default DashboardPage;