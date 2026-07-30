import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

const CAMPUS_BG_URL =
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1920&auto=format&fit=crop";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  padding: "11px 12px 11px 38px",
  color: "#ffffff",
  fontSize: "13px",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  transition: "border-color 0.2s",
  backdropFilter: "blur(4px)",
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [halls, setHalls] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    universityId: "",
    hallId: "",
  });

  useEffect(() => {
    api
      .get("/universities")
      .then((res) => setUniversities(res.data.data || []));
  }, []);

  useEffect(() => {
    if (!form.universityId) return setHalls([]);
    api
      .get(`/universities/${form.universityId}/halls`)
      .then((res) => setHalls(res.data.data || []))
      .catch(() => setHalls([]));
  }, [form.universityId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.universityId ||
      !form.hallId
    )
      return toast.error("All fields required");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      toast.success(
        "Account created! Check your email to verify before signing in.",
        { duration: 5000 }
      );
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100vh",
        backgroundImage: `url(${CAMPUS_BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(145deg, rgba(10, 20, 30, 0.88) 0%, rgba(0, 0, 0, 0.75) 100%)",
          zIndex: 1,
        }}
      />

      {/* Main card with scrollable inner content if needed */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "420px",
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: "28px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Hide scrollbar for Chrome/Safari */}
        <style>{`
          div[style*="max-height: 95vh"]::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "28px",
            padding: "28px 26px 26px",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                borderRadius: "14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(13,148,136,0.3)",
                marginBottom: "6px",
              }}
            >
              <span
                style={{ fontSize: "18px", fontWeight: "900", color: "white" }}
              >
                U
              </span>
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "white",
                letterSpacing: "1px",
              }}
            >
              UniHall
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.4)",
                marginTop: "1px",
                letterSpacing: "2px",
              }}
            >
              SMART HALL MANAGEMENT
            </div>
          </div>

          {/* Header */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "2px",
                color: "#14b8a6",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              Student Sign Up
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Create your account
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.45)",
                marginTop: "2px",
              }}
            >
              Takes less than a minute.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Name */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                    zIndex: 1,
                  }}
                >
                  👤
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                  }
                />
              </div>

              {/* University */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                    zIndex: 1,
                  }}
                >
                  🏫
                </span>
                <select
                  name="universityId"
                  value={form.universityId}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    cursor: "pointer",
                    color: form.universityId ? "#ffffff" : "rgba(255,255,255,0.4)",
                    paddingRight: "12px",
                  }}
                >
                  <option value="" disabled>
                    Select University
                  </option>
                  {universities.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.shortName} — {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hall */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                    zIndex: 1,
                  }}
                >
                  🏠
                </span>
                <select
                  name="hallId"
                  value={form.hallId}
                  onChange={handleChange}
                  disabled={!form.universityId}
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    cursor: form.universityId ? "pointer" : "not-allowed",
                    opacity: form.universityId ? 1 : 0.5,
                    color: form.hallId ? "#ffffff" : "rgba(255,255,255,0.4)",
                    paddingRight: "12px",
                  }}
                >
                  <option value="" disabled>
                    Select Hall
                  </option>
                  {halls.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
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

              {/* Password */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                    zIndex: 1,
                  }}
                >
                  🔒
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  style={{ ...inputStyle, paddingRight: "38px" }}
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
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "14px",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  background: loading
                    ? "#0d9488"
                    : "linear-gradient(135deg, #14b8a6, #0d9488)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(13,148,136,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
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
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.45)",
              fontSize: "12px",
              marginTop: "16px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#14b8a6",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.15)",
            fontSize: "10px",
            marginTop: "12px",
          }}
        >
          © 2026 UniHall. All rights reserved.
        </p>
      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder, select option {
          color: rgba(255,255,255,0.35);
        }
        select option {
          background: #1a2634;
          color: white;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(20,30,40,0.8) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;