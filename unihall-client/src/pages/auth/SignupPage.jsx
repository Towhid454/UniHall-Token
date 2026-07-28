import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "12px",
  padding: "13px 14px 13px 40px",
  color: "white",
  fontSize: "14px",
  outline: "none",
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
      toast.success("Account created! Check your email to verify before signing in.", {
        duration: 5000,
      });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { icon: "👤", name: "name", type: "text", placeholder: "Full Name" },
    { icon: "✉️", name: "email", type: "email", placeholder: "Student Email" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #0d2137 50%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blobs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "380px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            padding: "32px 28px",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                borderRadius: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(13,148,136,0.4)",
                marginBottom: "10px",
              }}
            >
              <span
                style={{ fontSize: "20px", fontWeight: "900", color: "white" }}
              >
                U
              </span>
            </div>
            <div
              style={{ fontSize: "20px", fontWeight: "700", color: "white" }}
            >
              Create Account
            </div>
            <div
              style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}
            >
              Join your hall community
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {/* Name */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "15px",
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
                  onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
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
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "15px",
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
                    color: form.universityId ? "white" : "#64748b",
                  }}
                >
                  <option value="" disabled style={{ background: "#1e293b" }}>
                    Select University
                  </option>
                  {universities.map((u) => (
                    <option
                      key={u._id}
                      value={u._id}
                      style={{ background: "#1e293b", color: "white" }}
                    >
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
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "15px",
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
                    color: form.hallId ? "white" : "#64748b",
                  }}
                >
                  <option value="" disabled style={{ background: "#1e293b" }}>
                    Select Hall
                  </option>
                  {halls.map((h) => (
                    <option
                      key={h._id}
                      value={h._id}
                      style={{ background: "#1e293b", color: "white" }}
                    >
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
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "15px",
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
                  onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
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
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "15px",
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
                  style={{ ...inputStyle, paddingRight: "42px" }}
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
                    fontSize: "15px",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px",
                  color: "white",
                  fontSize: "15px",
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
                      width: "20px",
                      height: "20px",
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

          <p
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "13px",
              marginTop: "18px",
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
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, select::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
};

export default SignupPage;
