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
    label: "Pending",
  },
  in_progress: {
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.3)",
    icon: "🔄",
    label: "In Progress",
  },
  resolved: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    icon: "✅",
    label: "Resolved",
  },
};

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "" });

  const fetchTickets = async () => {
    try {
      const res = await api.get("/support/tickets/my");
      setTickets(res.data.data || []);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async () => {
    if (!form.subject.trim()) return toast.error("Subject is required");
    if (!form.description.trim()) return toast.error("Description is required");
    setSubmitting(true);
    try {
      await api.post("/support/tickets", form);
      toast.success("Support ticket created!");
      setShowModal(false);
      setForm({ subject: "", description: "" });
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: tickets.length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    pending: tickets.filter((t) => t.status === "pending").length,
  };

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
              borderTop: "3px solid #6366f1",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <div
              style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}
            >
              🎧 Support / Help
            </div>
            <div
              style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}
            >
              Report issues & track resolutions
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              border: "none",
              borderRadius: "12px",
              padding: "10px 16px",
              color: "white",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
            }}
          >
            + New Ticket
          </button>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {[
            {
              label: "Total",
              value: stats.total,
              icon: "📊",
              color: "#0d9488",
              bg: "rgba(13,148,136,0.08)",
            },
            {
              label: "Resolved",
              value: stats.resolved,
              icon: "✅",
              color: "#10b981",
              bg: "rgba(16,185,129,0.08)",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: "⏳",
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.08)",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "14px 10px",
                textAlign: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                {s.icon}
              </div>
              <div
                style={{ fontSize: "20px", fontWeight: "900", color: s.color }}
              >
                {s.value}
              </div>
              <div
                style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tickets List */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "12px",
          }}
        >
          My Tickets
        </div>

        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "52px 24px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎧</div>
            <div
              style={{ fontWeight: "700", color: "#0f172a", fontSize: "15px" }}
            >
              No tickets yet
            </div>
            <div
              style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}
            >
              Create a ticket to report an issue
            </div>
          </motion.div>
        ) : (
          tickets.map((ticket, i) => {
            const st = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
            return (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  marginBottom: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    height: "3px",
                    background: `linear-gradient(90deg, ${st.color}, transparent)`,
                  }}
                />
                <div style={{ padding: "16px" }}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          flexShrink: 0,
                          background: st.bg,
                          borderRadius: "11px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "17px",
                        }}
                      >
                        {st.icon}
                      </div>
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
                          {ticket.subject}
                        </div>
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "11px",
                            marginTop: "2px",
                          }}
                        >
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "en-BD",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
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
                        flexShrink: 0,
                        marginLeft: "8px",
                      }}
                    >
                      {st.label}
                    </span>
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: "#334155",
                      lineHeight: "1.5",
                    }}
                  >
                    {ticket.description}
                  </div>

                  {/* Resolution Note */}
                  {ticket.resolutionNote && (
                    <div
                      style={{
                        marginTop: "10px",
                        background: "rgba(16,185,129,0.05)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        borderRadius: "10px",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#10b981",
                          fontWeight: "700",
                          marginBottom: "4px",
                        }}
                      >
                        ✅ Admin Resolution
                      </div>
                      <div style={{ fontSize: "12px", color: "#334155" }}>
                        {ticket.resolutionNote}
                      </div>
                      {ticket.resolvedAt && (
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            marginTop: "4px",
                          }}
                        >
                          Resolved:{" "}
                          {new Date(ticket.resolvedAt).toLocaleDateString(
                            "en-BD",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* New Ticket Modal */}
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
                  🎧 New Support Ticket
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

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="Brief title of your issue"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe your issue in detail so we can help you faster..."
                  rows={5}
                  style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <button
                onClick={handleSubmit}
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
                  boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
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
                  "Submit Ticket"
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
};

export default SupportPage;
