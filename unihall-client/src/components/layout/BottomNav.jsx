import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/dashboard", icon: "🏠", label: "Home" },
  { path: "/dining", icon: "🍽️", label: "Dining" },
  { path: "/wallet", icon: "💳", label: "Wallet" },
  { path: "/room", icon: "🚪", label: "Room" },
  { path: "/profile", icon: "👤", label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0 12px",
        zIndex: 100,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {tabs.map((tab) => {
        const active =
          location.pathname === tab.path ||
          (tab.path !== "/dashboard" && location.pathname.startsWith(tab.path));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "4px 12px",
              borderRadius: "12px",
              transition: "all 0.2s",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                filter: active ? "none" : "grayscale(0.5) opacity(0.6)",
                transform: active ? "scale(1.15)" : "scale(1)",
                transition: "all 0.2s",
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: active ? "700" : "500",
                color: active ? "#0d9488" : "#94a3b8",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </span>
            {active && (
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  background: "#0d9488",
                  borderRadius: "50%",
                  marginTop: "-1px",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
