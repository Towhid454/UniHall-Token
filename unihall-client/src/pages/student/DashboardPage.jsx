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

  const stats = [
    { label: "Student ID", value: user?.studentId || "—" },
    { label: "Department", value: user?.department || "—" },
    { label: "Session", value: user?.session || "—" },
    { label: "Status", value: (user?.status || "active").toUpperCase() },
  ];

  return (
    <AppShell>
      {/* Institutional Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "20px",
          padding: "32px 36px",
          marginBottom: "28px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Architectural watermark motif */}
        <div
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "150px",
            lineHeight: 1,
            opacity: 0.045,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🏛️
        </div>
        <div
          style={{
            position: "absolute",
            left: "-40px",
            bottom: "-60px",
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle, rgba(13,148,136,0.22) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "13.5px",
              fontWeight: 500,
              marginBottom: "6px",
            }}
          >
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </div>
          <div
            style={{
              color: "white",
              fontSize: "26px",
              fontWeight: "700",
              letterSpacing: "-0.3px",
              lineHeight: 1.25,
              maxWidth: "600px",
            }}
          >
            {user?.hall?.name || "Your Hall"}
          </div>

          {/* Stat row with dividers */}
          <div
            style={{
              display: "flex",
              gap: "0",
              marginTop: "26px",
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "16px",
              overflow: "hidden",
              maxWidth: "640px",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "18px 20px",
                  borderRight:
                    i < stats.length - 1
                      ? "1px solid rgba(255,255,255,0.09)"
                      : "none",
                }}
              >
                <div
                  style={{
                    color: "#8b95a8",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: "8px",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "17px",
                    lineHeight: 1.15,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Access */}
      <div
        style={{
          fontSize: "17px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "18px",
        }}
      >
        Quick Access
      </div>
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
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(mod.path)}
            style={{
              background: "white",
              border: "none",
              borderRadius: "20px",
              padding: "30px 16px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
              position: "relative",
              overflow: "hidden",
              transition: "box-shadow 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: mod.gradient,
                borderRadius: "20px 20px 0 0",
              }}
            />
            <div
              style={{
                width: "64px",
                height: "64px",
                background: mod.gradient,
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                boxShadow: `0 8px 20px ${mod.shadow}`,
              }}
            >
              {mod.icon}
            </div>
            <span
              style={{
                fontSize: "14.5px",
                fontWeight: "700",
                color: "#1e293b",
                textAlign: "center",
                letterSpacing: "-0.1px",
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
