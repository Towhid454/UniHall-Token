import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #0d2137 50%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          padding: "36px 32px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🔑</div>
          <div style={{ color: "white", fontSize: "19px", fontWeight: "700" }}>
            Forgot Password
          </div>
          <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
            {sent
              ? "Check your email for the reset link"
              : "Enter your email and we'll send a reset link"}
          </div>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                }}
              >
                ✉️
              </span>
              <input
                type="email"
                placeholder="Your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  padding: "13px 14px 13px 40px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                border: "none",
                borderRadius: "12px",
                padding: "13px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(13,148,136,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center", fontSize: "40px" }}>📬</div>
        )}

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "13px",
            marginTop: "20px",
          }}
        >
          Remembered it?{" "}
          <Link
            to="/login"
            style={{ color: "#14b8a6", fontWeight: "600", textDecoration: "none" }}
          >
            Sign In
          </Link>
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ForgotPasswordPage;