import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getRoleHome } from "../../utils/roleRoutes";

const getWelcomeMessage = (user) => {
  if (user.role === "universityAdmin" && user.university?.name) {
    return `Welcome to ${user.university.name}!`;
  }
  if (user.role === "hallAdmin" && user.hall?.name) {
    return `Welcome to ${user.hall.name}!`;
  }
  if (user.role === "superAdmin") {
    return "Welcome, Platform Admin!";
  }
  return `Welcome, ${user.name.split(" ")[0]}!`;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setShowResend(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("All fields required");
    setLoading(true);
    setShowResend(false);
    try {
      const res = await api.post("/auth/login", form);
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);
      toast.success(getWelcomeMessage(user));
      navigate(getRoleHome(user.role));
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
      if (message.toLowerCase().includes("verify your email")) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) return toast.error("Enter your email first");
    setResending(true);
    try {
      const res = await api.post("/auth/resend-verification", {
        email: form.email,
      });
      toast.success(res.data.message);
      setShowResend(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend email");
    } finally {
      setResending(false);
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blobs */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-120px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "-120px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "380px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            padding: "36px 32px",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                borderRadius: "18px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(13,148,136,0.4)",
                marginBottom: "12px",
              }}
            >
              <span
                style={{ fontSize: "22px", fontWeight: "900", color: "white" }}
              >
                U
              </span>
            </div>
            <div
              style={{ fontSize: "22px", fontWeight: "700", color: "white" }}
            >
              UniHall
            </div>
            <div
              style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}
            >
              Smart Hall Management
            </div>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "white",
              marginBottom: "20px",
            }}
          >
            Sign In
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
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
                ✉️
              </span>
              <input
                type="email"
                name="email"
                placeholder="Student Email"
                value={form.email}
                onChange={handleChange}
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
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                }
              />
            </div>

            {/* Password */}
            <div style={{ position: "relative", marginBottom: "8px" }}>
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
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
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

            {/* Resend verification prompt — only shows after "verify email" login error */}
            {showResend && (
              <div
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  marginBottom: "12px",
                  fontSize: "12px",
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <span>Didn't get the email?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  style={{
                    background: "rgba(245,158,11,0.2)",
                    border: "1px solid rgba(245,158,11,0.4)",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    color: "#fbbf24",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: resending ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resending ? "Sending..." : "Resend link"}
                </button>
              </div>
            )}

            {/* Forgot */}
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <Link
                to="/forgot-password"
                style={{
                  color: "#14b8a6",
                  fontSize: "12px",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading
                  ? "#0d9488"
                  : "linear-gradient(135deg, #14b8a6, #0d9488)",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                color: "white",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(13,148,136,0.4)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
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
                "Sign In"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "13px",
              marginTop: "20px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#14b8a6",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "11px",
            marginTop: "20px",
          }}
        >
          © 2026 UniHall. All rights reserved.
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
};

export default LoginPage;