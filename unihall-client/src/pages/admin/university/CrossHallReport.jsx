import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";

const UNIVERSITY_ADMIN_TABS = [
  { path: "/admin/university", icon: "📊", label: "Dashboard" },
  { path: "/admin/university/halls", icon: "🏛️", label: "Halls" },
  { path: "/admin/university/report", icon: "📈", label: "Cross-Hall Report" },
];

export default function CrossHallReport() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get("/university-admin/cross-hall-report");
        setReport(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <AdminShell tabs={UNIVERSITY_ADMIN_TABS} title="University Admin">
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#1F2D3D",
          marginBottom: "20px",
        }}
      >
        Cross-Hall Report
      </h1>

      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : report.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}
        >
          No hall data available yet.
        </div>
      ) : (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7FAF9", textAlign: "left" }}>
                {[
                  "Hall",
                  "Students",
                  "Occupancy",
                  "Pending Allotments",
                  "Pending Tickets",
                  "Feedback Avg",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "#6B7280",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.map((row) => (
                <tr key={row.hallId} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 600,
                      color: "#1F2D3D",
                    }}
                  >
                    {row.hallName}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{row.totalStudents}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {row.occupancyRate ?? "-"}%
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {row.pendingAllotments}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{row.pendingTickets}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {row.avgFeedbackRating ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
