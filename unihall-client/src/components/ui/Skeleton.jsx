export const SkeletonBox = ({
  width = "100%",
  height = "20px",
  radius = "8px",
  style = {},
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background:
        "linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%)",
      backgroundSize: "200% 100%",
      animation: "unihall-shimmer 1.4s ease-in-out infinite",
      ...style,
    }}
  />
);

export const SkeletonCard = () => (
  <div
    style={{
      background: "white",
      borderRadius: "18px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      padding: "18px",
    }}
  >
    <SkeletonBox height="16px" width="60%" style={{ marginBottom: "10px" }} />
    <SkeletonBox height="12px" width="40%" style={{ marginBottom: "14px" }} />
    <SkeletonBox height="32px" width="100%" radius="10px" />
  </div>
);

export const SkeletonGrid = ({ count = 4, minWidth = "260px" }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
      gap: "16px",
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div
    style={{
      background: "white",
      borderRadius: "18px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      padding: "16px",
    }}
  >
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: "flex", gap: "16px", padding: "10px 0" }}>
        <SkeletonBox width="20%" height="14px" />
        <SkeletonBox width="30%" height="14px" />
        <SkeletonBox width="15%" height="14px" />
        <SkeletonBox width="15%" height="14px" />
      </div>
    ))}
  </div>
);

// Inject keyframes once (call at app root, e.g. in main.jsx)
export const injectSkeletonStyles = () => {
  if (document.getElementById("unihall-shimmer-style")) return;
  const style = document.createElement("style");
  style.id = "unihall-shimmer-style";
  style.innerHTML = `
    @keyframes unihall-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
};
