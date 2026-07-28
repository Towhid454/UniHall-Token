import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AppShell from "../../components/layout/AppShell";

export default function DiningReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/feedback/my?category=dining");
      setReviews(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/feedback", { category: "dining", rating, message });
      toast.success("Review submitted");
      setRating(0);
      setMessage("");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#1F2D3D",
          marginBottom: "20px",
        }}
      >
        Dining Review
      </h1>

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: "20px",
          marginBottom: "24px",
          maxWidth: "480px",
        }}
      >
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#1F2D3D",
            marginBottom: "12px",
          }}
        >
          Rate today's dining
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: "28px",
                  cursor: "pointer",
                  color: star <= rating ? "#F59E0B" : "#E5E7EB",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Any comments (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              fontSize: "14px",
              marginBottom: "12px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "linear-gradient(135deg, #F08A3C, #FFB36B)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      <h2
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#1F2D3D",
          marginBottom: "12px",
        }}
      >
        My Past Reviews
      </h2>

      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : reviews.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "40px 0", color: "#6B7280" }}
        >
          No reviews submitted yet.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "480px",
          }}
        >
          {reviews.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: "14px 16px",
              }}
            >
              <div style={{ color: "#F59E0B", marginBottom: "4px" }}>
                {"★".repeat(r.rating)}
                <span style={{ color: "#E5E7EB" }}>
                  {"★".repeat(5 - r.rating)}
                </span>
              </div>
              {r.message && (
                <div style={{ fontSize: "13px", color: "#374151" }}>
                  {r.message}
                </div>
              )}
              <div
                style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}
              >
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
