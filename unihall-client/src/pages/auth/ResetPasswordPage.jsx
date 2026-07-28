import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Invalid or missing reset link");
    if (!form.newPassword || !form.confirmPassword)
      return toast.error("Fill in both fields");
    if (form.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: form.newPassword,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
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
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🔐</div>
          <div style={{ color: "white", fontSize: "19px", fontWeight: "700" }}>
            Set New Password
          </div>
          <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
            Choose a new password for your account
          </div>
        </div>

        {!token ? (
          <div
            style={{
              color: "#fca5a5",
              fontSize: "13px",
              textAlign: "center",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            This link is missing a reset token. Please request a new one.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                }}
              >
                🔒
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="New password (min 6 chars)"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  padding: "13px 42px 13px 40px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                }
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontSize: "16px",
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

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
                🔒
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
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
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "13px",
            marginTop: "20px",
          }}
        >
          <Link
            to="/login"
            style={{ color: "#14b8a6", fontWeight: "600", textDecoration: "none" }}
          >
            Back to Sign In
          </Link>
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResetPasswordPage;