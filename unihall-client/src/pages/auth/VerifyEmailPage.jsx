import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    api
      .post("/auth/verify-email", { token })
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed. Please try again.",
        );
      });
  }, [searchParams]);

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
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        {status === "verifying" && (
          <>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255,255,255,0.2)",
                borderTop: "3px solid #14b8a6",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div style={{ color: "white", fontSize: "15px" }}>
              Verifying your email...
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <div
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Email Verified!
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginBottom: "24px",
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
            <button
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                border: "none",
                borderRadius: "12px",
                padding: "13px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Go to Sign In
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
            <div
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Verification Failed
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginBottom: "24px",
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
            <Link
              to="/login"
              style={{
                display: "block",
                color: "#14b8a6",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Back to Sign In
            </Link>
          </>
        )}
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default VerifyEmailPage;