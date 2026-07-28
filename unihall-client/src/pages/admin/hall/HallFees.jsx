import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";
import { SkeletonTable } from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";

const HALL_ADMIN_TABS = [
  { path: "/admin/hall", icon: "📊", label: "Dashboard" },
  { path: "/admin/hall/allotments", icon: "🚪", label: "Allotments" },
  { path: "/admin/hall/students", icon: "👥", label: "Students" },
  { path: "/admin/hall/dining", icon: "🍽️", label: "Dining" },
  { path: "/admin/hall/fees", icon: "💳", label: "Fees" },
  { path: "/admin/hall/rooms", icon: "🛏️", label: "Rooms" },
  { path: "/admin/hall/tickets", icon: "🎧", label: "Tickets" },
];

const emptyForm = { studentId: "", title: "", totalAmount: "", dueDate: "" };

export default function HallFees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        api.get("/hall-admin/fees"),
        api.get("/hall-admin/students"),
      ]);
      setFees(feesRes.data.data || []);
      setStudents(studentsRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/hall-admin/fees", {
        ...form,
        totalAmount: Number(form.totalAmount),
      });
      toast.success("Fee assigned");
      setShowCreateModal(false);
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign fee");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = {
    unpaid: { bg: "#E74C3C22", color: "#E74C3C" },
    partial: { bg: "#F4B40022", color: "#F4B400" },
    paid: { bg: "#2ECC7122", color: "#2ECC71" },
  };

  return (
    <AdminShell tabs={HALL_ADMIN_TABS} title="Hall Admin">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2D3D" }}>
          Hall Fees
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "linear-gradient(135deg, #3B6FE0, #6FA8FF)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Assign Fee
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : fees.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <EmptyState
            icon="💳"
            title="No fees assigned yet"
            subtitle="Assign a fee to a student to get started."
          />
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
                {["Student", "Title", "Total", "Paid", "Due", "Status"].map(
                  (h) => (
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
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => {
                const due = fee.totalAmount - fee.paidAmount;
                const sc = statusColor[fee.status] || statusColor.unpaid;
                return (
                  <tr key={fee._id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        color: "#1F2D3D",
                      }}
                    >
                      {fee.student?.name}
                      <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                        {fee.student?.email}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>
                      {fee.title}
                    </td>
                    <td style={{ padding: "12px 16px" }}>৳{fee.totalAmount}</td>
                    <td style={{ padding: "12px 16px" }}>৳{fee.paidAmount}</td>
                    <td style={{ padding: "12px 16px" }}>৳{due}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          borderRadius: "20px",
                          padding: "3px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {fee.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
                Assign Hall Fee
              </h2>
              <form onSubmit={handleCreate}>
                <label style={labelStyle}>Student</label>
                <select
                  required
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                  style={inputStyle}
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} — {s.email}
                    </option>
                  ))}
                </select>
                <input
                  required
                  placeholder="Title (e.g. July-August Hall Fee)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={inputStyle}
                />
                <input
                  required
                  type="number"
                  placeholder="Total amount (৳)"
                  value={form.totalAmount}
                  onChange={(e) =>
                    setForm({ ...form, totalAmount: e.target.value })
                  }
                  style={inputStyle}
                />
                <label style={labelStyle}>Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  style={inputStyle}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    background: "linear-gradient(135deg, #3B6FE0, #6FA8FF)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Assigning..." : "Assign Fee"}
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

const labelStyle = {
  fontSize: "12px",
  color: "#6B7280",
  marginBottom: "4px",
  display: "block",
};
