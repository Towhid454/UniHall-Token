import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AdminShell from "../../../components/layout/AdminShell";
import api from "../../../api/axios";
import { SkeletonBox } from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";

const STATUS_CONFIG = {
  pending: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    label: "Pending",
  },
  approved: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    label: "Approved",
  },
  rejected: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    label: "Rejected",
  },
};

const AllotmentCardSkeleton = () => (
  <div
    style={{
      background: "white",
      borderRadius: "18px",
      marginBottom: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}
  >
    <SkeletonBox height="3px" radius="0" />
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SkeletonBox width="40px" height="40px" radius="12px" />
          <div>
            <SkeletonBox
              height="14px"
              width="100px"
              style={{ marginBottom: "6px" }}
            />
            <SkeletonBox height="11px" width="70px" />
          </div>
        </div>
        <SkeletonBox width="70px" height="18px" radius="20px" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}
      >
        {Array.from({ length: 4 }).map((_, j) => (
          <SkeletonBox key={j} height="44px" radius="10px" />
        ))}
      </div>
    </div>
  </div>
);

const HallAllotments = () => {
  const [allotments, setAllotments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [reviewModal, setReviewModal] = useState(null);
  const [form, setForm] = useState({
    status: "approved",
    roomId: "",
    reviewNote: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const [allotRes, roomsRes] = await Promise.all([
        api.get("/rooms/allotments", { params: { status: filter } }),
        api.get("/hall-admin/rooms"),
      ]);
      setAllotments(allotRes.data.data || []);
      setRooms(roomsRes.data.data || []);
    } catch {
      toast.error("Failed to load allotments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [filter]);

  const handleReview = async () => {
    if (!form.status) return toast.error("Select a decision");
    if (form.status === "approved" && !form.roomId)
      return toast.error("Select a room to assign");
    setSubmitting(true);
    try {
      await api.patch(`/rooms/allotments/${reviewModal._id}`, form);
      toast.success(`Request ${form.status}!`);
      setReviewModal(null);
      setForm({ status: "approved", roomId: "", reviewNote: "" });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
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
          🚪 Allotment Requests
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                flex: 1,
                padding: "9px 4px",
                background: filter === s ? STATUS_CONFIG[s].bg : "white",
                border: `1.5px solid ${filter === s ? STATUS_CONFIG[s].border : "#e2e8f0"}`,
                borderRadius: "12px",
                color: filter === s ? STATUS_CONFIG[s].color : "#94a3b8",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <AllotmentCardSkeleton key={i} />
            ))}
          </div>
        ) : allotments.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <EmptyState icon="📋" title={`No ${filter} requests`} />
          </div>
        ) : (
          allotments.map((a, i) => {
            const st = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
            return (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  marginBottom: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    height: "3px",
                    background: `linear-gradient(90deg, ${st.color}, transparent)`,
                  }}
                />
                <div style={{ padding: "16px" }}>
                  {/* Student Info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
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
                          background:
                            "linear-gradient(135deg, #6366f1, #4f46e5)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: "900",
                          color: "white",
                        }}
                      >
                        {a.student?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "#0f172a",
                          }}
                        >
                          {a.student?.name}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "11px" }}>
                          {a.student?.studentId || a.student?.email}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        background: st.bg,
                        border: `1px solid ${st.border}`,
                        borderRadius: "20px",
                        padding: "3px 10px",
                        color: st.color,
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      {st.label}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    {[
                      {
                        label: "Request Type",
                        value: a.requestType?.toUpperCase(),
                      },
                      {
                        label: "Room",
                        value: a.room?.roomNumber
                          ? `Room ${a.room.roomNumber}`
                          : "Any",
                      },
                      {
                        label: "Requested",
                        value: new Date(a.createdAt).toLocaleDateString(
                          "en-BD",
                        ),
                      },
                      {
                        label: "Department",
                        value: a.student?.department || "—",
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
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#0f172a",
                            marginTop: "2px",
                          }}
                        >
                          {item.value || "—"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {a.reason && (
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        marginBottom: "12px",
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
                        {a.reason}
                      </div>
                    </div>
                  )}

                  {/* Review Button */}
                  {a.status === "pending" && (
                    <button
                      onClick={() => {
                        setReviewModal(a);
                        setForm({
                          status: "approved",
                          roomId: "",
                          reviewNote: "",
                        });
                      }}
                      style={{
                        width: "100%",
                        padding: "11px",
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        border: "none",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                      }}
                    >
                      Review Request →
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal && (
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
            onClick={() => setReviewModal(null)}
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
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "17px",
                    color: "#0f172a",
                  }}
                >
                  Review Request
                </span>
                <button
                  onClick={() => setReviewModal(null)}
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

              {/* Student Summary */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "900",
                  }}
                >
                  {reviewModal.student?.name?.charAt(0)}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "13px",
                      color: "#0f172a",
                    }}
                  >
                    {reviewModal.student?.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {reviewModal.requestType?.toUpperCase()} request
                  </div>
                </div>
              </div>

              {/* Decision */}
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Decision</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    {
                      value: "approved",
                      label: "✅ Approve",
                      color: "#10b981",
                      bg: "rgba(16,185,129,0.1)",
                      border: "rgba(16,185,129,0.3)",
                    },
                    {
                      value: "rejected",
                      label: "❌ Reject",
                      color: "#ef4444",
                      bg: "rgba(239,68,68,0.1)",
                      border: "rgba(239,68,68,0.3)",
                    },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setForm({ ...form, status: d.value })}
                      style={{
                        flex: 1,
                        padding: "11px",
                        background: form.status === d.value ? d.bg : "#f8fafc",
                        border: `2px solid ${form.status === d.value ? d.border : "#e2e8f0"}`,
                        borderRadius: "12px",
                        color: form.status === d.value ? d.color : "#94a3b8",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Select (if approving) */}
              {form.status === "approved" && (
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Assign Room</label>
                  <select
                    value={form.roomId}
                    onChange={(e) =>
                      setForm({ ...form, roomId: e.target.value })
                    }
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      color: form.roomId ? "#0f172a" : "#94a3b8",
                    }}
                  >
                    <option value="">Select a room</option>
                    {rooms
                      .filter(
                        (r) =>
                          r.status === "available" ||
                          (r.occupants?.length || 0) < r.capacity,
                      )
                      .map((r) => (
                        <option key={r._id} value={r._id}>
                          Room {r.roomNumber} — {r.occupants?.length || 0}/
                          {r.capacity} occupied
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Note */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Note (optional)</label>
                <textarea
                  value={form.reviewNote}
                  onChange={(e) =>
                    setForm({ ...form, reviewNote: e.target.value })
                  }
                  placeholder="Add a note for the student..."
                  rows={3}
                  style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }}
                />
              </div>

              <button
                onClick={handleReview}
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "15px",
                  background:
                    form.status === "approved"
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #ef4444, #dc2626)",
                  border: "none",
                  borderRadius: "14px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: submitting ? "not-allowed" : "pointer",
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
                ) : form.status === "approved" ? (
                  "✅ Approve Request"
                ) : (
                  "❌ Reject Request"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminShell>
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

export default HallAllotments;
