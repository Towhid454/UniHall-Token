import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";

const SUPER_ADMIN_TABS = [
  { path: "/admin/super", icon: "📊", label: "Dashboard" },
  { path: "/admin/super/universities", icon: "🏫", label: "Universities" },
  { path: "/admin/super/users", icon: "👤", label: "Users" },
];

export default function SuperAdminUniversities() {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    shortName: "",
    code: "",
    emailDomain: "",
  });
  const [assignEmail, setAssignEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/super-admin/universities");
      setUniversities(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleOnboard = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/super-admin/universities", form);
      toast.success("University onboarded");
      setShowOnboardModal(false);
      setForm({ name: "", shortName: "", code: "", emailDomain: "" });
      fetchUniversities();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to onboard university",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (uni) => {
    const newStatus = uni.status === "active" ? "inactive" : "active";
    try {
      await api.patch(`/super-admin/universities/${uni._id}/status`, {
        status: newStatus,
      });
      toast.success(
        `University ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
      fetchUniversities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/super-admin/assign-university-admin", {
        email: assignEmail,
        university: showAssignModal._id,
      });
      toast.success("University admin assigned");
      setShowAssignModal(null);
      setAssignEmail("");
      fetchUniversities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell tabs={SUPER_ADMIN_TABS} title="Super Admin">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2D3D" }}>
          Universities
        </h1>
        <button
          onClick={() => setShowOnboardModal(true)}
          style={{
            background: "linear-gradient(135deg, #0E5E54, #159895)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Onboard University
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : universities.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}
        >
          No universities onboarded yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {universities.map((uni) => (
            <div
              key={uni._id}
              onClick={() => navigate(`/admin/super/universities/${uni._id}`)}
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#1F2D3D",
                    }}
                  >
                    {uni.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6B7280" }}>
                    {uni.code} · {uni.emailDomain}
                  </div>
                </div>
                <span
                  style={{
                    background:
                      uni.status === "active" ? "#2ECC7122" : "#E74C3C22",
                    color: uni.status === "active" ? "#2ECC71" : "#E74C3C",
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {uni.status.toUpperCase()}
                </span>
              </div>

              {/* Assigned Admin */}
              <div
                style={{
                  marginTop: "12px",
                  background: uni.universityAdmin ? "#F0FDFA" : "#FEF2F2",
                  border: `1px solid ${uni.universityAdmin ? "#0d9488" : "#FCA5A5"}`,
                  borderRadius: "10px",
                  padding: "8px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#6B7280",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  UNIVERSITY ADMIN
                </div>
                {uni.universityAdmin ? (
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "14px",
                        color: "#0d9488",
                      }}
                    >
                      {uni.universityAdmin.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>
                      {uni.universityAdmin.email}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#E74C3C",
                    }}
                  >
                    Not assigned
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAssignModal(uni);
                  }}
                  style={{
                    flex: 1,
                    background: "#F7FAF9",
                    border: "1px solid #0d9488",
                    color: "#0d9488",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Assign Uni Admin
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(uni);
                  }}
                  style={{
                    flex: 1,
                    background: uni.status === "active" ? "#FEF2F2" : "#F0FDF4",
                    border: `1px solid ${uni.status === "active" ? "#E74C3C" : "#2ECC71"}`,
                    color: uni.status === "active" ? "#E74C3C" : "#2ECC71",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {uni.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onboard Modal */}
      <AnimatePresence>
        {showOnboardModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 50,
            }}
            onClick={() => setShowOnboardModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "24px 24px 0 0",
                padding: "24px",
                width: "100%",
                maxWidth: "480px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1F2D3D",
                }}
              >
                Onboard New University
              </h2>
              <form onSubmit={handleOnboard}>
                <input
                  required
                  placeholder="Full name (e.g. Chittagong University of Engineering & Technology)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  required
                  placeholder="Short name (e.g. CUET)"
                  value={form.shortName}
                  onChange={(e) =>
                    setForm({ ...form, shortName: e.target.value })
                  }
                  style={inputStyle}
                />
                <input
                  required
                  placeholder="Code (e.g. CUET)"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  style={inputStyle}
                />
                <input
                  required
                  placeholder="Email domain (e.g. student.cuet.ac.bd)"
                  value={form.emailDomain}
                  onChange={(e) =>
                    setForm({ ...form, emailDomain: e.target.value })
                  }
                  style={inputStyle}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    background: "linear-gradient(135deg, #0E5E54, #159895)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Onboarding..." : "Onboard"}
                </button>
              </form>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  marginTop: "10px",
                  lineHeight: "1.5",
                }}
              >
                Note: an admin can only be assigned after someone from this
                university signs up as a student first (their email must match
                the domain above). Use "Assign Uni Admin" afterward.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign University Admin Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 50,
            }}
            onClick={() => setShowAssignModal(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "24px 24px 0 0",
                padding: "24px",
                width: "100%",
                maxWidth: "480px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "6px",
                  color: "#1F2D3D",
                }}
              >
                Assign University Admin
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "16px",
                }}
              >
                For: {showAssignModal.name}
              </p>
              <form onSubmit={handleAssignAdmin}>
                <input
                  required
                  type="email"
                  placeholder="User email (existing account)"
                  value={assignEmail}
                  onChange={(e) => setAssignEmail(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    background: "linear-gradient(135deg, #0E5E54, #159895)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Assigning..." : "Assign"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  marginBottom: "12px",
  fontSize: "14px",
  boxSizing: "border-box",
};
