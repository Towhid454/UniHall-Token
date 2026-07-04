import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AdminShell from "../../../components/layout/AdminShell";
import api from "../../../api/axios";

const STATUS_CONFIG = {
  active: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
  inactive: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.3)",
  },
  suspended: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
  },
};

const HallStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/hall-admin/students", {
        params: search ? { search } : {},
      });
      setStudents(res.data.data || []);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchStudents, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleStatusChange = async (studentId, newStatus) => {
    setUpdating(studentId);
    try {
      await api.patch(`/hall-admin/students/${studentId}/status`, {
        status: newStatus,
      });
      toast.success(`Student ${newStatus}`);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AdminShell>
      <div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "16px",
          }}
        >
          👥 Students ({students.length})
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, email, student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: "14px",
              padding: "12px 14px 12px 42px",
              fontSize: "13px",
              color: "#0f172a",
              outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "48px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #e2e8f0",
                borderTop: "3px solid #6366f1",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        ) : students.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "48px 20px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
            <div style={{ fontWeight: "600", color: "#64748b" }}>
              No students found
            </div>
          </div>
        ) : (
          students.map((student, i) => {
            const st = STATUS_CONFIG[student.status] || STATUS_CONFIG.active;
            return (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  marginBottom: "10px",
                  padding: "14px 16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      flexShrink: 0,
                      background: "linear-gradient(135deg, #0d9488, #0f766e)",
                      borderRadius: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "17px",
                      fontWeight: "900",
                      color: "white",
                    }}
                  >
                    {student.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {student.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        marginTop: "2px",
                      }}
                    >
                      {student.studentId || student.email}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        marginTop: "1px",
                      }}
                    >
                      {[
                        student.department,
                        student.batch ? `Batch ${student.batch}` : null,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        background: st.bg,
                        border: `1px solid ${st.border}`,
                        borderRadius: "20px",
                        padding: "3px 8px",
                        color: st.color,
                        fontSize: "9px",
                        fontWeight: "700",
                      }}
                    >
                      {student.status?.toUpperCase()}
                    </span>

                    {updating === student._id ? (
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #e2e8f0",
                          borderTop: "2px solid #6366f1",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    ) : (
                      <select
                        value={student.status}
                        onChange={(e) =>
                          handleStatusChange(student._id, e.target.value)
                        }
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "4px 6px",
                          fontSize: "10px",
                          color: "#64748b",
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspend</option>
                      </select>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminShell>
  );
};

export default HallStudents;
