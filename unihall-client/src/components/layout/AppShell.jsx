import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { path: "/dashboard", label: "Home", icon: "🏠" },
  { path: "/dining", label: "Dining", icon: "🍽️" },
  { path: "/wallet", label: "Wallet", icon: "💳" },
  { path: "/room", label: "Room", icon: "🚪" },
  { path: "/profile", label: "Profile", icon: "👤" },
  { path: "/feedback", label: "Feedback", icon: "📣" },
  { path: "/support", label: "Support", icon: "🎧" },
];

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hallName = user?.hall?.name;
  const universityShort = user?.university?.shortName;
  const badgeLetter = (hallName || "U").charAt(0).toUpperCase();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Navbar */}
      <nav
        style={{
          background:
            "linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 20px rgba(13,148,136,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Hall Identity */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              background: "rgba(255,255,255,0.18)",
              borderRadius: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              fontWeight: "900",
              color: "white",
              border: "1px solid rgba(255,255,255,0.35)",
              flexShrink: 0,
            }}
          >
            {badgeLetter}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontWeight: "800",
                  fontSize: "15px",
                  lineHeight: 1.15,
                  maxWidth: "220px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {hallName || "UniHall"}
              </div>
              {universityShort && (
                <span
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    color: "#1e293b",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "0.4px",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(245,158,11,0.4)",
                    flexShrink: 0,
                  }}
                >
                  {universityShort}
                </span>
              )}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.3px",
                marginTop: "2px",
              }}
            >
              Student Portal
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV_LINKS.map((link) => {
            const active =
              location.pathname === link.path ||
              (link.path !== "/dashboard" &&
                location.pathname.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  background: active ? "rgba(255,255,255,0.2)" : "transparent",
                  border: active
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "1px solid transparent",
                  borderRadius: "10px",
                  padding: "7px 14px",
                  color: active ? "white" : "rgba(255,255,255,0.75)",
                  fontSize: "13px",
                  fontWeight: active ? "700" : "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "14px" }}>{link.icon}</span>
                {link.label}
              </button>
            );
          })}
        </div>

        {/* User Info + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ color: "white", fontWeight: "700", fontSize: "13px" }}
            >
              {user?.name}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}>
              {user?.studentId || user?.email}
            </div>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: "900",
              color: "white",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={logout}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "10px",
              padding: "7px 14px",
              color: "white",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ⎋ Logout
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div
        style={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "28px 24px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <div
        style={{
          background: "white",
          borderTop: "1px solid #e2e8f0",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
          {hallName ? `© 2026 ${hallName}` : "© 2026 UniHall"}
        </div>
        <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
          Powered by UniHall · v1.0.0
        </div>
      </div>
    </div>
  );
};

export default AppShell;
