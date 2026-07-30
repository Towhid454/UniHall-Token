import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getRoleHome } from "../../utils/roleRoutes";

// ইউনিভার্সিটি ক্যাম্পাসের ছবি (চাইলে বদলে দিতে পারেন)
const CAMPUS_BG_URL =
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1920&auto=format&fit=crop";

// ডার্ক কার্ডের জন্য ইনপুট স্টাইল
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "12px",
  padding: "14px 14px 14px 44px",
  color: "#ffffff",
  fontSize: "14px",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  transition: "border-color 0.2s",
  backdropFilter: "blur(4px)",
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
      toast.success(`Welcome${user.name ? " " + user.name.split(" ")[0] : ""}!`);
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
        backgroundImage: `url(${CAMPUS_BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* ডার্ক ওভারলে */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(145deg, rgba(10, 20, 30, 0.88) 0%, rgba(0, 0, 0, 0.75) 100%)",
          zIndex: 1,
        }}
      />

      {/* মেইন কার্ড */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "28px",
            padding: "40px 32px",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* লোগো */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                borderRadius: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(13,148,136,0.35)",
                marginBottom: "10px",
              }}
            >
              <span
                style={{ fontSize: "22px", fontWeight: "900", color: "white" }}
              >
                U
              </span>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "white",
                letterSpacing: "1px",
              }}
            >
              UniHall
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "2px",
                letterSpacing: "2px",
              }}
            >
              SMART HALL MANAGEMENT
            </div>
          </div>

          {/* হেডার টেক্সট */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "2px",
                color: "#14b8a6",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Welcome Back
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Sign in to your account
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "4px",
              }}
            >
              Manage your hall, tokens, and fees.
            </div>
          </div>

          {/* ফর্ম */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* ইমেইল */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "16px",
                    zIndex: 1,
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
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                  }
                />
              </div>

              {/* পাসওয়ার্ড */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "16px",
                    zIndex: 1,
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
                  style={{ ...inputStyle, paddingRight: "42px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
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
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "16px",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* রিসেন্ড ভেরিফিকেশন প্রম্পট */}
              {showResend && (
                <div
                  style={{
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    borderRadius: "10px",
                    padding: "10px 14px",
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
                      background: "rgba(245,158,11,0.15)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      borderRadius: "6px",
                      padding: "4px 12px",
                      color: "#fbbf24",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: resending ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {resending ? "Sending..." : "Resend link"}
                  </button>
                </div>
              )}

              {/* ফরগট পাসওয়ার্ড */}
              <div style={{ textAlign: "right", marginTop: "-2px" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#14b8a6",
                    fontSize: "12px",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* সাবমিট বাটন */}
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
                  fontFamily: "'Inter', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 20px rgba(13,148,136,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
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
            </div>
          </form>

          {/* সাইনআপ লিংক */}
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              marginTop: "22px",
              fontFamily: "'Inter', sans-serif",
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

        {/* ফুটার কপিরাইট */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.2)",
            fontSize: "11px",
            marginTop: "20px",
          }}
        >
          © 2026 UniHall. All rights reserved.
        </p>
      </motion.div>

      {/* স্পিন অ্যানিমেশন */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(255,255,255,0.35);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;