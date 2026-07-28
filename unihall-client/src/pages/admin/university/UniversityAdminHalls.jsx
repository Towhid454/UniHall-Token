import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";

const UNIVERSITY_ADMIN_TABS = [
  { path: "/admin/university", icon: "📊", label: "Dashboard" },
  { path: "/admin/university/halls", icon: "🏛️", label: "Halls" },
  { path: "/admin/university/report", icon: "📈", label: "Cross-Hall Report" },
];

export default function UniversityAdminHalls() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    code: "",
    totalRooms: "",
    provostName: "",
  });
  const [assignEmail, setAssignEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchHalls = async () => {
    try {
      const res = await api.get("/university-admin/halls");
      setHalls(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load halls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const handleCreateHall = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/university-admin/halls", {
        ...createForm,
        totalRooms: Number(createForm.totalRooms),
      });
      toast.success("Hall created");
      setShowCreateModal(false);
      setCreateForm({ name: "", code: "", totalRooms: "", provostName: "" });
      fetchHalls();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create hall");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(
        `/university-admin/halls/${showAssignModal._id}/assign-admin`,
        {
          email: assignEmail,
        },
      );
      toast.success("Hall admin assigned");
      setShowAssignModal(null);
      setAssignEmail("");
      fetchHalls();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell tabs={UNIVERSITY_ADMIN_TABS} title="University Admin">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2D3D" }}>
          Halls
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
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
          + Create Hall
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : halls.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}
        >
          No halls yet. Create your first hall to get started.
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
            <div
              key={hall._id}
              style={{
                background: "white",
                borderRadius: "18px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: "18px",
              }}
            >
              <div
                style={{ fontWeight: 700, fontSize: "16px", color: "#1F2D3D" }}
              >
                {hall.name}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "10px",
                }}
              >
                Code: {hall.code} · Rooms: {hall.totalRooms}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "12px",
                }}
              >
                Admin:{" "}
                {hall.hallAdmin?.name ||
                  hall.hallAdmin?.email ||
                  "Not assigned"}
              </div>
              <button
                onClick={() => setShowAssignModal(hall)}
                style={{
                  background: "#F7FAF9",
                  border: "1px solid #0d9488",
                  color: "#0d9488",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Assign Hall Admin
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Hall Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
            onClick={() => setShowCreateModal(false)}
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
                Create New Hall
              </h2>
              <form onSubmit={handleCreateHall}>
                <input
                  required
                  placeholder="Hall name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  style={inputStyle}
                />
                <input
                  required
                  placeholder="Hall code (e.g. SAR)"
                  value={createForm.code}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, code: e.target.value })
                  }
                  style={inputStyle}
                />
                <input
                  required
                  type="number"
                  placeholder="Total rooms"
                  value={createForm.totalRooms}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, totalRooms: e.target.value })
                  }
                  style={inputStyle}
                />
                <input
                  placeholder="Provost name (optional)"
                  value={createForm.provostName}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      provostName: e.target.value,
                    })
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
                  {submitting ? "Creating..." : "Create Hall"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Admin Modal */}
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
                Assign Hall Admin
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
