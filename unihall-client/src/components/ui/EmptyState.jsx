export default function EmptyState({
  icon = "📭",
  title = "Nothing here yet",
  subtitle = "",
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        color: "#6B7280",
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "12px" }}>{icon}</div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#1F2D3D",
          marginBottom: "4px",
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>{subtitle}</div>
      )}
    </div>
  );
}
