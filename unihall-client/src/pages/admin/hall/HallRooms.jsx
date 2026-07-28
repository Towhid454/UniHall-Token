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

const emptyForm = { roomNumber: "", floor: "", capacity: 2, type: "double" };

export default function HallRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/hall-admin/rooms");
      setRooms(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/rooms", {
        roomNumber: form.roomNumber,
        floor: form.floor,
        capacity: Number(form.capacity),
        type: form.type,
      });
      toast.success("Room created");
      setShowCreateModal(false);
      setForm(emptyForm);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create room");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = {
    available: { bg: "#2ECC7122", color: "#2ECC71" },
    full: { bg: "#E74C3C22", color: "#E74C3C" },
    maintenance: { bg: "#F4B40022", color: "#F4B400" },
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
          Rooms
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "linear-gradient(135deg, #0F766E, #14B8A6)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Create Room
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={4} />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon="🛏️"
          title="No rooms yet"
          subtitle="Create one to start allotting students."
        />
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
                  "Room",
                  "Floor",
                  "Type",
                  "Capacity",
                  "Occupants",
                  "Status",
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
              {rooms.map((room) => {
                const sc = statusColor[room.status] || statusColor.available;
                return (
                  <tr key={room._id} style={{ borderTop: "1px solid #F0F0F0" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        color: "#1F2D3D",
                      }}
                    >
                      {room.roomNumber}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>
                      {room.floor || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>
                      {room.type}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>
                      {room.capacity}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>
                      {room.occupants?.length || 0}/{room.capacity}
                    </td>
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
                        {room.status.toUpperCase()}
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
                Create Room
              </h2>
              <form onSubmit={handleCreate}>
                <input
                  required
                  placeholder="Room Number (e.g. 101)"
                  value={form.roomNumber}
                  onChange={(e) =>
                    setForm({ ...form, roomNumber: e.target.value })
                  }
                  style={inputStyle}
                />
                <input
                  placeholder="Floor (e.g. 1st)"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  style={inputStyle}
                />
                <label style={labelStyle}>Capacity</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                  style={inputStyle}
                />
                <label style={labelStyle}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={inputStyle}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="quad">Quad</option>
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    background: "linear-gradient(135deg, #0F766E, #14B8A6)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Creating..." : "Create Room"}
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
