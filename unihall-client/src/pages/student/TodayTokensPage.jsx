import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AppShell from "../../components/layout/AppShell";
import api from "../../api/axios";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: "monospace", letterSpacing: "1px" }}>
      {time.toLocaleTimeString("en-BD", { hour12: true })}
    </span>
  );
};

const MEAL_TIMES = {
  lunch: {
    start: "12:30 PM",
    end: "2:50 PM",
    icon: "🌞",
    gradient: "linear-gradient(135deg, #0d9488, #0f766e)",
    startMins: 12 * 60 + 30,
    endMins: 14 * 60 + 50,
  },
  dinner: {
    start: "8:30 PM",
    end: "11:00 PM",
    icon: "🌙",
    gradient: "linear-gradient(135deg, #1e293b, #334155)",
    startMins: 20 * 60 + 30,
    endMins: 23 * 60,
  },
};

const TodayTokensPage = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState(null);
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-BD", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const fetchTokens = async () => {
    try {
      const res = await api.get("/dining/tokens");
      const data = res.data.data || [];
      const MEAL_ORDER = { lunch: 0, dinner: 1 };
      const sorted = [...data].sort(
        (a, b) =>
          (MEAL_ORDER[a.mealType] ?? 99) - (MEAL_ORDER[b.mealType] ?? 99),
      );
      setTokens(sorted);
    } catch {
      toast.error("Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const nowMins = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const isLive = (mealType) => {
    const meal = MEAL_TIMES[mealType];
    if (!meal) return false;
    const mins = nowMins();
    return mins >= meal.startMins && mins <= meal.endMins;
  };

  const isExpired = (mealType) => {
    const meal = MEAL_TIMES[mealType];
    if (!meal) return false;
    return nowMins() > meal.endMins;
  };

  if (loading)
    return (
      <AppShell>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #0d9488",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </AppShell>
    );

  return (
    <AppShell>
      <div style={{ padding: "16px" }}>
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
              Today's Tokens
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{dateStr}</div>
          </div>
          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "20px",
              padding: "6px 14px",
              color: "#10b981",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            ● <Clock />
          </div>
        </div>

        {tokens.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "48px 20px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍽️</div>
            <div
              style={{ fontWeight: "700", color: "#0f172a", fontSize: "15px" }}
            >
              No tokens for today
            </div>
            <div
              style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}
            >
              Purchase a dining plan to get tokens
            </div>
          </div>
        ) : (
          tokens.map((token, i) => {
            const meal = MEAL_TIMES[token.mealType] || {};
            const used = token.status === "used";
            const live =
              !used && isLive(token.mealType) && token.status === "active";
            const expired = !used && !live && isExpired(token.mealType);

            return (
              <motion.div
                key={token._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ marginBottom: "16px" }}
              >
                <div
                  style={{
                    background: meal.gradient,
                    borderRadius: "20px",
                    padding: "20px",
                    boxShadow: `0 8px 24px ${used || expired ? "rgba(0,0,0,0.1)" : "rgba(13,148,136,0.25)"}`,
                    opacity: used || expired ? 0.75 : 1,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Decorative */}
                  <div
                    style={{
                      position: "absolute",
                      right: "-20px",
                      bottom: "-20px",
                      width: "100px",
                      height: "100px",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "50%",
                    }}
                  />

                  {/* Top Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
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
                          width: "40px",
                          height: "40px",
                          background: "rgba(255,255,255,0.15)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                        }}
                      >
                        {meal.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: "16px",
                          }}
                        >
                          {token.mealType.charAt(0).toUpperCase() +
                            token.mealType.slice(1)}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "12px",
                          }}
                        >
                          {meal.start} — {meal.end}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      style={{
                        background: used
                          ? "rgba(255,255,255,0.15)"
                          : live
                            ? "rgba(16,185,129,0.25)"
                            : expired
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(255,255,255,0.15)",
                        border: `1px solid ${
                          used
                            ? "rgba(255,255,255,0.2)"
                            : live
                              ? "rgba(16,185,129,0.5)"
                              : expired
                                ? "rgba(239,68,68,0.5)"
                                : "rgba(255,255,255,0.2)"
                        }`,
                        borderRadius: "20px",
                        padding: "5px 12px",
                        color: used
                          ? "rgba(255,255,255,0.6)"
                          : live
                            ? "#6ee7b7"
                            : expired
                              ? "#fca5a5"
                              : "white",
                        fontSize: "11px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {used
                        ? "✅ USED"
                        : live
                          ? "● LIVE"
                          : expired
                            ? "✕ EXPIRED"
                            : "⏳ UPCOMING"}
                    </div>
                  </div>

                  {used ? (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>✅</span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "13px",
                        }}
                      >
                        Token has been used
                      </span>
                    </div>
                  ) : expired ? (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>✕</span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "13px",
                        }}
                      >
                        Meal window closed — token missed
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setQrModal(token)}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        padding: "12px",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>📲</span> Tap to show
                      QR code
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {qrModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setQrModal(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                borderRadius: "24px",
                padding: "28px 24px",
                width: "100%",
                maxWidth: "320px",
                textAlign: "center",
                boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontWeight: "800",
                  fontSize: "18px",
                  marginBottom: "4px",
                }}
              >
                Your Token QR
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "13px",
                  marginBottom: "20px",
                }}
              >
                {qrModal.mealType?.charAt(0).toUpperCase() +
                  qrModal.mealType?.slice(1)}
              </div>

              {/* QR Image */}
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  marginBottom: "20px",
                  display: "inline-block",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                {qrModal.qrImage ? (
                  <img
                    src={qrModal.qrImage}
                    alt="QR Code"
                    style={{
                      width: "180px",
                      height: "180px",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "180px",
                      height: "180px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    No QR available
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  marginBottom: "16px",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                }}
              >
                {qrModal.qrPayload?.substring(0, 24)}...
              </div>

              <button
                onClick={() => setQrModal(null)}
                style={{
                  background: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 40px",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: "#0d9488",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
};

export default TodayTokensPage;
