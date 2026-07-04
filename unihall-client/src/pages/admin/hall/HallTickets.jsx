import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AdminShell from "../../../components/layout/AdminShell";
import api from "../../../api/axios";

const STATUS_CONFIG = {
  pending: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    label: "Pending",
  },
  in_progress: {
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.3)",
    label: "In Progress",
  },
  resolved: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    label: "Resolved",
  },
};

const HallTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [resolveModal, setResolveModal] = useState(null);
  const [form, setForm] = useState({ status: "resolved", resolutionNote: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/support/tickets", {
        params: { status: filter },
      });
      setTickets(res.data.data || []);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await api.patch(`/support/tickets/${resolveModal._id}`, form);
      toast.success(`Ticket ${form.status}!`);
      setResolveModal(null);
      setForm({ status: "resolved", resolutionNote: "" });
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
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
          🎧 Support Tickets
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["pending", "in_progress", "resolved"].map((s) => (
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
                fontSize: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
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
        ) : tickets.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "48px 20px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎧</div>
            <div style={{ fontWeight: "600", color: "#64748b" }}>
              No {filter.replace("_", " ")} tickets
            </div>
          </div>
        ) : (
          tickets.map((ticket, i) => {
            const st = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
            return (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "700",
                          fontSize: "14px",
                          color: "#0f172a",
                        }}
                      >
                        {ticket.subject}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          marginTop: "2px",
                        }}
                      >
                        {ticket.student?.name} •{" "}
                        {new Date(ticket.createdAt).toLocaleDateString("en-BD")}
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
                        marginLeft: "8px",
                      }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: "#334155",
                      lineHeight: "1.5",
                      marginBottom: "12px",
                    }}
                  >
                    {ticket.description}
                  </div>
                  {ticket.status !== "resolved" && (
                    <button
                      onClick={() => {
                        setResolveModal(ticket);
                        setForm({
                          status:
                            ticket.status === "pending"
                              ? "in_progress"
                              : "resolved",
                          resolutionNote: "",
                        });
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        border: "none",
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      {ticket.status === "pending"
                        ? "Start Progress →"
                        : "Mark Resolved →"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Resolve Modal */}
      <AnimatePresence>
        {resolveModal && (
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
            onClick={() => setResolveModal(null)}
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
                  fontWeight: "800",
                  fontSize: "17px",
                  color: "#0f172a",
                  marginBottom: "16px",
                }}
              >
                Update Ticket
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Update Status</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    {
                      value: "in_progress",
                      label: "🔄 In Progress",
                      color: "#3b82f6",
                    },
                    {
                      value: "resolved",
                      label: "✅ Resolved",
                      color: "#10b981",
                    },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setForm({ ...form, status: d.value })}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background:
                          form.status === d.value ? `${d.color}15` : "#f8fafc",
                        border: `2px solid ${form.status === d.value ? d.color : "#e2e8f0"}`,
                        borderRadius: "12px",
                        color: form.status === d.value ? d.color : "#94a3b8",
                        fontWeight: "700",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Resolution Note</label>
                <textarea
                  value={form.resolutionNote}
                  onChange={(e) =>
                    setForm({ ...form, resolutionNote: e.target.value })
                  }
                  placeholder="Describe what was done to resolve this issue..."
                  rows={3}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
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
                ) : (
                  "Update Ticket"
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

export default HallTickets;
