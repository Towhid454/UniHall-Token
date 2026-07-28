import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";

const SUPER_ADMIN_TABS = [
  { path: "/admin/super", icon: "📊", label: "Dashboard" },
  { path: "/admin/super/universities", icon: "🏫", label: "Universities" },
  { path: "/admin/super/users", icon: "👤", label: "Users" },
];

export default function UniversityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/super-admin/universities/${id}`);
        setUniversity(res.data.data.university);
        setHalls(res.data.data.halls);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load university");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <AdminShell tabs={SUPER_ADMIN_TABS} title="Super Admin">
      <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "8px" }}>
        <span
          onClick={() => navigate("/admin/super/universities")}
          style={{ cursor: "pointer", color: "#0d9488", fontWeight: 600 }}
        >
          Universities
        </span>
        {" > "}
        {university?.name || "..."}
      </div>

      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : (
        <>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#1F2D3D",
              marginBottom: "4px",
            }}
          >
            {university.name}
          </h1>
          <div
            style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}
          >
            {university.code} · {university.emailDomain} ·{" "}
            <span
              style={{
                background:
                  university.status === "active" ? "#2ECC7122" : "#E74C3C22",
                color: university.status === "active" ? "#2ECC71" : "#E74C3C",
                borderRadius: "20px",
                padding: "2px 10px",
                fontWeight: 700,
                fontSize: "11px",
              }}
            >
              {university.status.toUpperCase()}
            </span>
          </div>

          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1F2D3D",
              marginBottom: "12px",
            }}
          >
            Halls ({halls.length})
          </h2>

          {halls.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#6B7280",
              }}
            >
              No halls under this university yet.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {halls.map((hall) => (
                <motion.div
                  key={hall._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/admin/super/halls/${hall._id}`)}
                  style={{
                    background: "white",
                    borderRadius: "18px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    padding: "18px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#1F2D3D",
                    }}
                  >
                    {hall.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginBottom: "10px",
                    }}
                  >
                    Code: {hall.code}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "13px",
                      color: "#374151",
                    }}
                  >
                    <div>👥 {hall.studentCount} students</div>
                    <div>🚪 {hall.totalRooms} rooms</div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginTop: "8px",
                    }}
                  >
                    Admin: {hall.hallAdmins?.[0]?.name || "Not assigned"}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
