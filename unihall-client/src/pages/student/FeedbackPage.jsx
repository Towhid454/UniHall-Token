import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AppShell from "../../components/layout/AppShell";
import api from "../../api/axios";
import { SkeletonBox } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

const CATEGORIES = [
  {
    value: "dining",
    label: "Dining",
    icon: "🍽️",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    value: "room",
    label: "Room",
    icon: "🚪",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    value: "general",
    label: "General",
    icon: "📣",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
  },
];

const ALL_FILTER = {
  value: "all",
  label: "All",
  icon: "📋",
  color: "#0d9488",
  bg: "rgba(13,148,136,0.1)",
};

const STATUS_CONFIG = {
  pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Pending" },
  in_progress: {
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    label: "In Progress",
  },
  resolved: { color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "Resolved" },
};

const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: "6px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "26px",
          padding: "2px",
          filter: star <= value ? "none" : "grayscale(1) opacity(0.3)",
          transition: "all 0.15s",
        }}
      >
        ⭐
      </button>
    ))}
  </div>
);

const FeedbackCardSkeleton = () => (
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
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SkeletonBox width="38px" height="38px" radius="11px" />
          <div>
            <SkeletonBox
              height="13px"
              width="70px"
              style={{ marginBottom: "6px" }}
            />
            <SkeletonBox height="11px" width="90px" />
          </div>
        </div>
        <SkeletonBox width="70px" height="18px" radius="20px" />
      </div>
      <SkeletonBox height="40px" radius="10px" />
    </div>
  </div>
);

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [form, setForm] = useState({
    category: "dining",
    message: "",
    rating: 0,
  });

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get("/feedback/my");
      setFeedbacks(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load feedbacks");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async () => {
    if (!form.message.trim()) return toast.error("Message is required");
    if (!form.category) return toast.error("Select a category");
    setSubmitting(true);
    try {
      await api.post("/feedback", form);
      toast.success("Feedback submitted! Thank you 🙏");
      setShowModal(false);
      setForm({ category: "dining", message: "", rating: 0 });
      fetchFeedbacks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleFeedbacks =
    activeFilter === "all"
      ? feedbacks
      : feedbacks.filter((fb) => fb.category === activeFilter);

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
              📣 Hall Feedbacks
            </div>
            <div
              style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}
            >
              Share your experience
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #ec4899, #db2777)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "20px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(236,72,153,0.35)",
            }}
          >
            +
          </button>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {[ALL_FILTER, ...CATEGORIES].map((cat) => {
            const isActive = activeFilter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                style={{
                  background: isActive ? cat.color : cat.bg,
                  border: `1.5px solid ${cat.color}`,
                  borderRadius: "20px",
                  padding: "7px 14px",
                  color: isActive ? "white" : cat.color,
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.15s",
                }}
              >
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>

        {/* Feedback List */}
        {loading ? (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <FeedbackCardSkeleton key={i} />
            ))}
          </div>
        ) : visibleFeedbacks.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <EmptyState
              icon="😊"
              title={
                activeFilter === "all"
                  ? "No feedbacks yet!"
                  : `No ${activeFilter} feedbacks yet!`
              }
              subtitle="Tap + to share your thoughts ✨"
            />
          </div>
        ) : (
          visibleFeedbacks.map((fb, i) => {
            const cat =
              CATEGORIES.find((c) => c.value === fb.category) || CATEGORIES[2];
            const st = STATUS_CONFIG[fb.status] || STATUS_CONFIG.pending;
            return (
              <motion.div
                key={fb._id}
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
                    background: `linear-gradient(90deg, ${cat.color}, transparent)`,
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          background: cat.bg,
                          borderRadius: "11px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "17px",
                        }}
                      >
                        {cat.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "700",
                            fontSize: "13px",
                            color: "#0f172a",
                          }}
                        >
                          {cat.label}
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "11px" }}>
                          {new Date(fb.createdAt).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        background: st.bg,
                        color: st.color,
                        borderRadius: "20px",
                        padding: "3px 10px",
                        fontSize: "10px",
                        fontWeight: "700",
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
                      marginBottom: fb.rating ? "10px" : "0",
                    }}
                  >
                    {fb.message}
                  </div>

                  {fb.rating > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "8px",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Rating:
                      </span>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: "14px",
                            filter:
                              s <= fb.rating
                                ? "none"
                                : "grayscale(1) opacity(0.3)",
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Submit Feedback Modal */}
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
                maxHeight: "90vh",
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
                  ✨ Share Feedback
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

              {/* Category */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Category</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setForm({ ...form, category: cat.value })}
                      style={{
                        flex: 1,
                        padding: "10px 6px",
                        background:
                          form.category === cat.value ? cat.bg : "#f8fafc",
                        border: `2px solid ${form.category === cat.value ? cat.color : "#e2e8f0"}`,
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{cat.icon}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color:
                            form.category === cat.value ? cat.color : "#94a3b8",
                        }}
                      >
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Rating (optional)</label>
                <StarRating
                  value={form.rating}
                  onChange={(r) => setForm({ ...form, rating: r })}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Share your thoughts about the hall services..."
                  rows={4}
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
                    lineHeight: "1.6",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "linear-gradient(135deg, #ec4899, #db2777)",
                  border: "none",
                  borderRadius: "14px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(236,72,153,0.35)",
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
                  "Submit Feedback ✨"
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

export default FeedbackPage;
