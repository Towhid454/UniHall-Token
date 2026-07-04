import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AppShell from "../../components/layout/AppShell";
import api from "../../api/axios";

const STATUS_CONFIG = {
  pending: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    icon: "⏳",
  },
  approved: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    icon: "✅",
  },
  rejected: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    icon: "❌",
  },
};

const REQUEST_TYPES = ["new", "change", "cancel"];

const RoomAllotmentPage = () => {
  const [rooms, setRooms] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    roomId: "",
    requestType: "new",
    reason: "",
  });

  const fetchAll = async () => {
    try {
      const [roomsRes, allotmentsRes] = await Promise.all([
        api.get("/rooms"),
        api.get("/rooms/allotments/my"),
      ]);
      setRooms(roomsRes.data.data || []);
      setAllotments(allotmentsRes.data.data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async () => {
    if (!form.requestType) return toast.error("Select request type");
    setSubmitting(true);
    try {
      await api.post("/rooms/allotments", {
        roomId: form.roomId || undefined,
        requestType: form.requestType,
        reason: form.reason,
      });
      toast.success("Room request submitted!");
      setShowModal(false);
      setForm({ roomId: "", requestType: "new", reason: "" });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const hasPending = allotments.some((a) => a.status === "pending");

  if (loading)
    return (
      <AppShell>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #0d9488",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AppShell>
    );

  return (
    <AppShell>
      <div>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}
          >
            🚪 Room Allotment
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
            Request and track your room
          </div>
        </div>

        {/* Request Button */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            if (hasPending) {
              toast.error("You already have a pending request");
              return;
            }
            setShowModal(true);
          }}
          style={{
            width: "100%",
            background: hasPending
              ? "#f1f5f9"
              : "linear-gradient(135deg, #f97316, #ea580c)",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            color: hasPending ? "#94a3b8" : "white",
            fontSize: "15px",
            fontWeight: "700",
            cursor: hasPending ? "not-allowed" : "pointer",
            marginBottom: "20px",
            boxShadow: hasPending ? "none" : "0 4px 16px rgba(249,115,22,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          🏠 {hasPending ? "Pending Request Exists" : "New Allotment Request"}
        </motion.button>

        {/* Available Rooms */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "12px",
          }}
        >
          Available Rooms (
          {rooms.filter((r) => r.status === "available").length})
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {rooms
            .filter((r) => r.status === "available")
            .slice(0, 6)
            .map((room, i) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "14px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "linear-gradient(135deg, #f97316, #ea580c)",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    🚪
                  </div>
                  <span
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      color: "#10b981",
                      border: "1px solid rgba(16,185,129,0.3)",
                      borderRadius: "20px",
                      padding: "2px 8px",
                      fontSize: "10px",
                      fontWeight: "700",
                    }}
                  >
                    AVAILABLE
                  </span>
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    color: "#0f172a",
                  }}
                >
                  Room {room.roomNumber}
                </div>
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    marginTop: "3px",
                  }}
                >
                  Floor {room.floor || "—"} • {room.type}
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    padding: "6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Occupants
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {room.occupants?.length || 0}/{room.capacity}
                  </span>
                </div>
              </motion.div>
            ))}
        </div>

        {rooms.filter((r) => r.status === "available").length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              textAlign: "center",
              marginBottom: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏠</div>
            <div
              style={{ color: "#64748b", fontWeight: "600", fontSize: "14px" }}
            >
              No rooms available
            </div>
          </div>
        )}

        {/* My Allotments */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "12px",
          }}
        >
          My Allotments
        </div>

        {allotments.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "40px 20px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
            <div style={{ fontWeight: "600", color: "#64748b" }}>
              No allotment requests yet
            </div>
            <div
              style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}
            >
              Submit a request to get a room
            </div>
          </div>
        ) : (
          allotments.map((allotment, i) => {
            const st = STATUS_CONFIG[allotment.status] || STATUS_CONFIG.pending;
            const startDate = allotment.startDate
              ? new Date(allotment.startDate).toLocaleDateString("en-BD")
              : null;

            return (
              <motion.div
                key={allotment._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  marginBottom: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {/* Top accent */}
                <div
                  style={{
                    height: "3px",
                    background: `linear-gradient(90deg, ${st.color}, transparent)`,
                  }}
                />

                <div style={{ padding: "16px" }}>
                  {/* Header Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: st.bg,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                        }}
                      >
                        {st.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "#0f172a",
                          }}
                        >
                          Room {allotment.room?.roomNumber || "—"}
                        </div>
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "11px",
                            marginTop: "2px",
                          }}
                        >
                          {allotment.hall?.name || "Hall"}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        background: st.bg,
                        border: `1px solid ${st.border}`,
                        borderRadius: "20px",
                        padding: "4px 10px",
                        color: st.color,
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      {allotment.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {[
                      {
                        label: "Request Type",
                        value: allotment.requestType?.toUpperCase(),
                      },
                      { label: "Start Date", value: startDate || "Ongoing" },
                      {
                        label: "End Date",
                        value: allotment.endDate
                          ? new Date(allotment.endDate).toLocaleDateString(
                              "en-BD",
                            )
                          : "Ongoing",
                      },
                      {
                        label: "Requested On",
                        value: new Date(allotment.createdAt).toLocaleDateString(
                          "en-BD",
                        ),
                      },
                    ].map((item, j) => (
                      <div
                        key={j}
                        style={{
                          background: "#f8fafc",
                          borderRadius: "10px",
                          padding: "8px 10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            marginBottom: "2px",
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#0f172a",
                          }}
                        >
                          {item.value || "—"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reason */}
                  {allotment.reason && (
                    <div
                      style={{
                        marginTop: "10px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          marginBottom: "3px",
                        }}
                      >
                        Reason
                      </div>
                      <div style={{ fontSize: "12px", color: "#334155" }}>
                        {allotment.reason}
                      </div>
                    </div>
                  )}

                  {/* Review Note */}
                  {allotment.reviewNote && (
                    <div
                      style={{
                        marginTop: "8px",
                        background:
                          allotment.status === "approved"
                            ? "rgba(16,185,129,0.05)"
                            : "rgba(239,68,68,0.05)",
                        border: `1px solid ${allotment.status === "approved" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                        borderRadius: "10px",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          marginBottom: "3px",
                        }}
                      >
                        Admin Note
                      </div>
                      <div style={{ fontSize: "12px", color: "#334155" }}>
                        {allotment.reviewNote}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "24px 24px 0 0",
                padding: "24px 20px 48px",
                width: "100%",
                maxWidth: "480px",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
            >
              {/* Handle */}
              <div
                style={{
                  width: "36px",
                  height: "4px",
                  background: "#e2e8f0",
                  borderRadius: "9999px",
                  margin: "0 auto 20px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "17px",
                    color: "#0f172a",
                  }}
                >
                  🏠 Allotment Request
                </span>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Select Hall (display only) */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>🏛️ Select Hall</label>
                <div
                  style={{
                    ...inputStyle,
                    color: "#0f172a",
                    background: "#f8fafc",
                  }}
                >
                  Your assigned hall (auto-selected)
                </div>
              </div>

              {/* Select Room */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>🚪 Select Room</label>
                <select
                  value={form.roomId}
                  onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                  style={{
                    ...inputStyle,
                    cursor: "pointer",
                    color: form.roomId ? "#0f172a" : "#94a3b8",
                  }}
                >
                  <option value="">Select Room (optional)</option>
                  {rooms
                    .filter((r) => r.status === "available")
                    .map((r) => (
                      <option key={r._id} value={r._id}>
                        Room {r.roomNumber} — Floor {r.floor || "?"} (
                        {r.occupants?.length || 0}/{r.capacity})
                      </option>
                    ))}
                </select>
              </div>

              {/* Request Type */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>⇄ Request Type</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {REQUEST_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, requestType: type })}
                      style={{
                        flex: 1,
                        padding: "10px 4px",
                        background:
                          form.requestType === type
                            ? "rgba(249,115,22,0.1)"
                            : "#f8fafc",
                        border: `2px solid ${form.requestType === type ? "#f97316" : "#e2e8f0"}`,
                        borderRadius: "10px",
                        color:
                          form.requestType === type ? "#f97316" : "#64748b",
                        fontWeight: "700",
                        fontSize: "12px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>✏️ Reason (optional)</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Provide a reason for your request..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "none",
                    lineHeight: "1.5",
                    height: "auto",
                    paddingTop: "12px",
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  border: "none",
                  borderRadius: "14px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
                  opacity: submitting ? 0.8 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {submitting ? (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                ) : (
                  "➤ Submit Request"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
};

const labelStyle = {
  fontSize: "12px",
  color: "#64748b",
  fontWeight: "600",
  display: "block",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f8fafc",
  border: "1.5px solid #e2e8f0",
  borderRadius: "12px",
  padding: "12px 14px",
  fontSize: "13px",
  color: "#0f172a",
  outline: "none",
  appearance: "none",
};

export default RoomAllotmentPage;
