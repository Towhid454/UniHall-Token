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
  },
  {
    icon: "🍽️",
    label: "Today's Dining",
    path: "/dining/today",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    icon: "🥘",
    label: "Dining",
    path: "/dining",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
  {
    icon: "💰",
    label: "Hall Fee",
    path: "/hall-fee",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  },
  {
    icon: "🚪",
    label: "Room Allotment",
    path: "/room",
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
  },
  {
    icon: "💳",
    label: "My Wallet",
    path: "/wallet",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    icon: "⭐",
    label: "Dining Review",
    path: "/dining/review",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
  },
  {
    icon: "📣",
    label: "Hall Feedback",
    path: "/feedback",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
  },
  {
    icon: "🎧",
    label: "Support/Help",
    path: "/support",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
  },
];

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
      {/* Hero Banner - Clean & Professional */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "28px",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
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
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#cbd5e1",
              fontSize: "12px",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Stats Row - Minimal Card style */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "14px 18px",
                background: "rgba(255,255,255,0.02)",
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
              }}
            >
              <div
                style={{
                  color: "#8b95a8",
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: "4px",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {s.label === "Status" ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: getStatusColor(s.value),
                      }}
                    />
                    {s.value}
                  </>
                ) : (
                  s.value
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Access Title */}
      <div
        style={{
          fontSize: "17px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "18px",
          letterSpacing: "-0.2px",
        }}
      >
        Quick Access
      </div>

      {/* Modules Grid - Clean cards with just hover lift */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
          gap: "18px",
        }}
      >
        {modules.map((mod, i) => (
          <motion.button
            key={mod.path}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, duration: 0.3 }}
            whileHover={{
              y: -4,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 15 },
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(mod.path)}
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.04)",
              borderRadius: "16px",
              padding: "24px 12px 20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            }}
            // Hover shadow handled via CSS in style tag below
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.04)";
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: mod.gradient,
                borderRadius: "16px 16px 0 0",
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
                color: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                flexShrink: 0,
              }}
            >
              {mod.icon}
            </div>
            <span
              style={{
                fontSize: "14px",
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
    </AppShell>
  );
};

export default DashboardPage;