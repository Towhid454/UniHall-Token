import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";

// Swap this for your own campus photo whenever you have one —
// just replace the URL, nothing else needs to change.
const CAMPUS_PHOTO_URL =
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1600&auto=format&fit=crop";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "#FFFFFF",
  border: "1px solid #E2DED3",
  borderRadius: "10px",
  padding: "13px 14px 13px 44px",
  color: "#131826",
  fontSize: "14px",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
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
    <div className="uh-wrap">
      {/* LEFT — photo panel */}
      <div className="uh-photo">
        <div className="uh-photo-img" />
        <div className="uh-photo-overlay" />
        <div className="uh-seal-ring" />

        <div className="uh-brand">
          <div className="uh-brand-mark">U</div>
          <span className="uh-brand-word">UNIHALL</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="uh-photo-copy"
        >
          <h1 className="uh-headline">
            Where your hall
            <br />
            becomes home.
          </h1>
          <p className="uh-subline">
            Room allotments, dining tokens, hall fees and support —
            all in one account.
          </p>
        </motion.div>
      </div>

      {/* RIGHT — form panel */}
      <div className="uh-form">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: "380px" }}
        >
          <div style={{ marginBottom: "26px" }}>
            <div className="uh-form-eyebrow">Student Sign Up</div>
            <div className="uh-form-title">Create your account</div>
            <div
              style={{
                fontSize: "13px",
                color: "#6B7280",
                marginTop: "4px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Takes less than a minute.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Name */}
              <div style={{ position: "relative" }}>
                <span className="uh-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                  onBlur={(e) => (e.target.style.borderColor = "#E2DED3")}
                />
              </div>

              {/* University */}
              <div style={{ position: "relative" }}>
                <span className="uh-icon">🏫</span>
                <select
                  name="universityId"
                  value={form.universityId}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    appearance: "none",
                    cursor: "pointer",
                    color: form.universityId ? "#131826" : "#94A3B8",
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
                <span className="uh-icon">🏠</span>
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
                    color: form.hallId ? "#131826" : "#94A3B8",
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
                <span className="uh-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Student Email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                  onBlur={(e) => (e.target.style.borderColor = "#E2DED3")}
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative" }}>
                <span className="uh-icon">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  style={{ ...inputStyle, paddingRight: "42px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                  onBlur={(e) => (e.target.style.borderColor = "#E2DED3")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="uh-eye-btn"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="uh-submit-btn">
                {loading ? <div className="uh-spinner" /> : "Create Account"}
              </button>
            </div>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "#6B7280",
              fontSize: "13px",
              marginTop: "20px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" className="uh-link">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, select::placeholder { color: #94A3B8; }

        .uh-wrap {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .uh-photo {
          flex: 1.15;
          position: relative;
          overflow: hidden;
          min-height: 280px;
        }
        .uh-photo-img {
          position: absolute;
          inset: 0;
          background-image: url('${CAMPUS_PHOTO_URL}');
          background-size: cover;
          background-position: center;
        }
        .uh-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            165deg,
            rgba(11,18,32,0.55) 0%,
            rgba(11,18,32,0.88) 55%,
            rgba(13,148,136,0.55) 100%
          );
        }
        .uh-seal-ring {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          border: 1px solid rgba(232,177,76,0.35);
          top: 8%;
          right: -140px;
          pointer-events: none;
        }

        .uh-brand {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 28px 32px 0;
        }
        .uh-brand-mark {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #14b8a6, #0d9488);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-weight: 700;
          color: white;
          font-size: 15px;
        }
        .uh-brand-word {
          color: rgba(255,255,255,0.9);
          letter-spacing: 3px;
          font-size: 13px;
          font-weight: 600;
        }

        .uh-photo-copy {
          position: relative;
          z-index: 2;
          padding: 32px;
          max-width: 480px;
          margin-top: 40vh;
        }
        .uh-headline {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 40px;
          line-height: 1.15;
          color: white;
          margin: 0 0 14px;
        }
        .uh-subline {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255,255,255,0.75);
          margin: 0;
        }

        .uh-form {
          flex: 1;
          background: #F6F3EC;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
        }
        .uh-form-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #0d9488;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .uh-form-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
          color: #131826;
        }

        .uh-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          z-index: 1;
        }
        .uh-eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 15px;
        }

        .uh-submit-btn {
          width: 100%;
          margin-top: 6px;
          background: linear-gradient(135deg, #14b8a6, #0d9488);
          border: none;
          border-radius: 10px;
          padding: 14px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(13,148,136,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .uh-submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.75;
        }
        .uh-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .uh-link {
          color: #0d9488;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .uh-wrap { flex-direction: column; }
          .uh-photo { flex: none; height: 260px; min-height: 260px; }
          .uh-photo-copy { margin-top: 0; padding: 22px; }
          .uh-headline { font-size: 28px; }
          .uh-subline { display: none; }
          .uh-seal-ring { width: 260px; height: 260px; right: -100px; top: -40px; }
          .uh-form { flex: none; padding: 32px 20px 56px; }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;