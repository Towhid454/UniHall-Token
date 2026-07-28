import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";

const SUPER_ADMIN_TABS = [
  { path: "/admin/super", icon: "📊", label: "Dashboard" },
  { path: "/admin/super/universities", icon: "🏫", label: "Universities" },
  { path: "/admin/super/users", icon: "👤", label: "Users" },
];

export default function HallDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/super-admin/halls/${id}`);
        setData(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load hall");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <AdminShell tabs={SUPER_ADMIN_TABS} title="Super Admin">
      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : (
        <>
          <div
            style={{ fontSize: "13px", color: "#6B7280", marginBottom: "8px" }}
          >
            <span
              onClick={() => navigate("/admin/super/universities")}
              style={{ cursor: "pointer", color: "#0d9488", fontWeight: 600 }}
            >
              Universities
            </span>
            {" > "}
            <span
              onClick={() =>
                navigate(
                  `/admin/super/universities/${data.hall.university._id}`,
                )
              }
              style={{ cursor: "pointer", color: "#0d9488", fontWeight: 600 }}
            >
              {data.hall.university?.name}
            </span>
            {" > "}
            {data.hall.name}
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#1F2D3D",
              marginBottom: "20px",
            }}
          >
            {data.hall.name} ({data.hall.code})
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {[
              { label: "Students", value: data.studentCount, color: "#0d9488" },
              { label: "Rooms", value: data.roomCount, color: "#6366f1" },
              {
                label: "Total Capacity",
                value: data.totalCapacity,
                color: "#3B6FE0",
              },
              {
                label: "Occupied",
                value: data.totalOccupied,
                color: "#F4B400",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  padding: "18px",
                  borderTop: `4px solid ${s.color}`,
                }}
              >
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#1F2D3D",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1F2D3D",
              marginBottom: "12px",
            }}
          >
            Hall Admins
          </h2>
          {data.hallAdmins.length === 0 ? (
            <div style={{ color: "#6B7280" }}>No hall admin assigned yet.</div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {data.hallAdmins.map((admin) => (
                <div
                  key={admin._id}
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#1F2D3D",
                    }}
                  >
                    {admin.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>
                    {admin.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
