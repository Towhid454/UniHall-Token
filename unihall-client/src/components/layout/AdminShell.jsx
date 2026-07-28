import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const HALL_ADMIN_TABS = [
  { path: "/admin/hall", icon: "📊", label: "Dashboard" },
  { path: "/admin/hall/allotments", icon: "🚪", label: "Allotments" },
  { path: "/admin/hall/students", icon: "👥", label: "Students" },
  { path: "/admin/hall/dining", icon: "🍽️", label: "Dining" },
  { path: "/admin/hall/fees", icon: "💳", label: "Fees" },
  { path: "/admin/hall/rooms", icon: "🛏️", label: "Rooms" },
  { path: "/admin/hall/tickets", icon: "🎧", label: "Tickets" },
];

const ROLE_LABELS = {
  hallAdmin: "Hall Admin",
  universityAdmin: "University Admin",
  superAdmin: "Super Admin",
};

const AdminShell = ({
  children,
  tabs = HALL_ADMIN_TABS,
  title = "Hall Admin",
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHallAdmin = user?.role === "hallAdmin";
  const isUniversityAdmin = user?.role === "universityAdmin";

  const identityName = isHallAdmin
    ? user?.hall?.name
    : isUniversityAdmin
      ? user?.university?.name
      : "UniHall";

  const identitySubtitle = isHallAdmin
    ? user?.university?.shortName
      ? `${user.university.shortName} · Hall Admin Portal`
      : "Hall Admin Portal"
    : isUniversityAdmin
      ? "University Admin Portal"
      : "Platform Administration";

  const badgeLetter = (identityName || "U").charAt(0).toUpperCase();

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
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Identity */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
          onClick={() => navigate(tabs[0]?.path || "/")}
          onKeyDown={() => {}}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              borderRadius: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "900",
              color: "white",
              flexShrink: 0,
            }}
          >
            {badgeLetter}
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontWeight: "800",
                fontSize: "15px",
                lineHeight: 1.15,
                maxWidth: "260px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {identityName}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "2px",
              }}
            >
              <span
                style={{
                  background: "rgba(99,102,241,0.25)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  borderRadius: "20px",
                  padding: "1px 8px",
                  color: "#a5b4fc",
                  fontSize: "9.5px",
                  fontWeight: "700",
                  letterSpacing: "0.3px",
                }}
              >
                {(ROLE_LABELS[user?.role] || title).toUpperCase()}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "10px",
                }}
              >
                {identitySubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                style={{
                  background: active ? "rgba(99,102,241,0.2)" : "transparent",
                  border: active
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid transparent",
                  borderRadius: "10px",
                  padding: "7px 16px",
                  color: active ? "#a5b4fc" : "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  fontWeight: active ? "700" : "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            );
          })}
        </div>

        {/* User + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ color: "white", fontWeight: "700", fontSize: "13px" }}
            >
              {user?.name}
            </div>
            <div style={{ color: "#64748b", fontSize: "11px" }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              padding: "7px 14px",
              color: "#94a3b8",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ⎋ Logout
          </button>
        </div>
      </nav>

      {/* Content */}
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
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
          {isHallAdmin || isUniversityAdmin
            ? `© 2026 ${identityName}`
            : "© 2026 UniHall — Admin Panel"}
        </div>
        <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
          Powered by UniHall · v1.0.0
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
