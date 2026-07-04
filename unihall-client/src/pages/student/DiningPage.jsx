import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AppShell from "../../components/layout/AppShell";
import api from "../../api/axios";

const DiningPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  const fetchAll = async () => {
    try {
      const [plansRes, walletRes, tokensRes] = await Promise.all([
        api.get("/dining/plans"),
        api.get("/wallet/me"),
        api.get("/dining/tokens"),
      ]);
      setPlans(plansRes.data.data || []);
      setWallet(walletRes.data.data?.wallet);

      // Group tokens by diningPlan to show purchased plans
      const tokens = tokensRes.data.data || [];
      const planMap = {};
      tokens.forEach((t) => {
        const pid = t.diningPlan?._id || t.diningPlan;
        if (!planMap[pid]) {
          planMap[pid] = {
            plan: t.diningPlan,
            tokens: [],
            lunch: 0,
            dinner: 0,
          };
        }
        planMap[pid].tokens.push(t);
        if (t.mealType === "lunch") planMap[pid].lunch++;
        else if (t.mealType === "dinner") planMap[pid].dinner++;
      });
      setMyPurchases(Object.values(planMap));
    } catch {
      toast.error("Failed to load dining data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    if (!wallet || wallet.balance < selectedPlan.price) {
      toast.error(`Insufficient balance. Need ৳${selectedPlan.price}`);
      return;
    }
    setPurchasing(true);
    try {
      const res = await api.post("/dining/purchase", {
        planId: selectedPlan._id,
      });
      toast.success(`${res.data.data.tokensGenerated} tokens generated!`);
      setShowPurchaseModal(false);
      setSelectedPlan(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  };

  const getStatusColor = (tokens) => {
    const today = new Date();
    const future = tokens.filter(
      (t) => new Date(t.date) >= today && t.status === "active",
    );
    if (future.length === 0)
      return {
        label: "COMPLETED",
        bg: "rgba(16,185,129,0.1)",
        color: "#10b981",
        border: "rgba(16,185,129,0.3)",
      };
    return {
      label: "ACTIVE",
      bg: "rgba(13,148,136,0.1)",
      color: "#0d9488",
      border: "rgba(13,148,136,0.3)",
    };
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
      <div>
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}
            >
              🍽️ Dining
            </div>
            <div
              style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}
            >
              Manage your meal tokens
            </div>
          </div>
          <button
            onClick={() => navigate("/dining/today")}
            style={{
              background: "linear-gradient(135deg, #0d9488, #0f766e)",
              border: "none",
              borderRadius: "12px",
              padding: "11px 20px",
              color: "white",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
            }}
          >
            Today's Tokens →
          </button>
        </div>

        {/* Top Row: Wallet + Purchase */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              borderRadius: "18px",
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            <div>
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                Wallet Balance
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: "28px",
                  fontWeight: "800",
                  marginTop: "4px",
                }}
              >
                ৳{wallet?.balance?.toFixed(2) || "0.00"}
              </div>
            </div>
            <button
              onClick={() => navigate("/wallet")}
              style={{
                background: "rgba(13,148,136,0.2)",
                border: "1px solid rgba(13,148,136,0.3)",
                borderRadius: "10px",
                padding: "10px 18px",
                color: "#14b8a6",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              + Deposit
            </button>
          </motion.div>

          <button
            onClick={() => setShowPurchaseModal(true)}
            style={{
              background: "linear-gradient(135deg, #14b8a6, #0d9488)",
              border: "none",
              borderRadius: "18px",
              padding: "24px",
              color: "white",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(13,148,136,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            🎟️ Purchase Token
          </button>
        </div>

        {/* Purchased Plans */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "16px",
          }}
        >
          Purchased Plans
        </div>

        {myPurchases.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🍽️</div>
            <div
              style={{ color: "#64748b", fontWeight: "600", fontSize: "15px" }}
            >
              No plans purchased yet
            </div>
            <div
              style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}
            >
              Purchase a plan to start getting tokens
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "20px",
            }}
          >
            {myPurchases.map((purchase, i) => {
              const statusInfo = getStatusColor(purchase.tokens);
              const totalTokens = purchase.tokens.length;
              const usedTokens = purchase.tokens.filter(
                (t) => t.status === "used",
              ).length;
              const dates = purchase.tokens.map((t) => new Date(t.date));
              const startDate = dates.length
                ? new Date(Math.min(...dates)).toISOString().split("T")[0]
                : "—";
              const endDate = dates.length
                ? new Date(Math.max(...dates)).toISOString().split("T")[0]
                : "—";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                    borderRadius: "20px",
                    padding: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "-20px",
                      top: "-20px",
                      width: "80px",
                      height: "80px",
                      background:
                        "radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          background: "rgba(13,148,136,0.2)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                        }}
                      >
                        📅
                      </div>
                      <div>
                        <div
                          style={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: "15px",
                          }}
                        >
                          {purchase.plan?.name || "Dining Plan"}
                        </div>
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "11px",
                            marginTop: "2px",
                          }}
                        >
                          {startDate} → {endDate}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        background: statusInfo.bg,
                        border: `1px solid ${statusInfo.border}`,
                        borderRadius: "20px",
                        padding: "4px 10px",
                        color: statusInfo.color,
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    {[
                      { icon: "🎟️", label: "Tokens", value: totalTokens },
                      { icon: "✅", label: "Used", value: usedTokens },
                      { icon: "🌞", label: "Lunch", value: purchase.lunch },
                      { icon: "🌙", label: "Dinner", value: purchase.dinner },
                    ].map((s, j) => (
                      <div
                        key={j}
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.07)",
                          borderRadius: "10px",
                          padding: "8px 4px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "14px" }}>{s.icon}</div>
                        <div
                          style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "700",
                          }}
                        >
                          {s.value}
                        </div>
                        <div style={{ color: "#64748b", fontSize: "9px" }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() =>
                        navigate("/dining/tokens", {
                          state: {
                            tokens: purchase.tokens,
                            plan: purchase.plan,
                          },
                        })
                      }
                      style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      View Tokens
                    </button>
                    <button
                      style={{
                        flex: 1,
                        background: "rgba(245,158,11,0.15)",
                        border: "1px solid rgba(245,158,11,0.3)",
                        borderRadius: "10px",
                        padding: "10px",
                        color: "#f59e0b",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Refund
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "24px 24px 0 0",
                padding: "24px 20px 40px",
                width: "100%",
                maxWidth: "480px",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: "17px",
                    color: "#0f172a",
                  }}
                >
                  🎟️ Purchase Token
                </span>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  background: "rgba(13,148,136,0.08)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  Current Balance
                </span>
                <span
                  style={{
                    color: "#0d9488",
                    fontWeight: "800",
                    fontSize: "16px",
                  }}
                >
                  ৳{wallet?.balance?.toFixed(2) || "0.00"}
                </span>
              </div>

              {plans.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#94a3b8",
                  }}
                >
                  No active dining plans available
                </div>
              ) : (
                plans.map((plan) => (
                  <div
                    key={plan._id}
                    onClick={() =>
                      setSelectedPlan(
                        selectedPlan?._id === plan._id ? null : plan,
                      )
                    }
                    style={{
                      border: `2px solid ${selectedPlan?._id === plan._id ? "#0d9488" : "#e2e8f0"}`,
                      borderRadius: "14px",
                      padding: "14px 16px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background:
                        selectedPlan?._id === plan._id
                          ? "rgba(13,148,136,0.05)"
                          : "white",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "#0f172a",
                          }}
                        >
                          {plan.name}
                        </div>
                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "12px",
                            marginTop: "3px",
                          }}
                        >
                          {plan.description}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "8px",
                          }}
                        >
                          {plan.mealsPerDay?.lunch && (
                            <span
                              style={{
                                background: "#fef3c7",
                                color: "#d97706",
                                borderRadius: "6px",
                                padding: "2px 8px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              🌞 Lunch
                            </span>
                          )}
                          {plan.mealsPerDay?.dinner && (
                            <span
                              style={{
                                background: "#ede9fe",
                                color: "#7c3aed",
                                borderRadius: "6px",
                                padding: "2px 8px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              🌙 Dinner
                            </span>
                          )}
                          <span
                            style={{
                              background: "#f1f5f9",
                              color: "#64748b",
                              borderRadius: "6px",
                              padding: "2px 8px",
                              fontSize: "11px",
                            }}
                          >
                            {plan.durationDays} days
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "800",
                            color: "#0d9488",
                          }}
                        >
                          ৳{plan.price}
                        </div>
                        {selectedPlan?._id === plan._id && (
                          <span style={{ fontSize: "18px" }}>✅</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {selectedPlan && (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    color: "white",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: purchasing ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 16px rgba(13,148,136,0.35)",
                    opacity: purchasing ? 0.8 : 1,
                  }}
                >
                  {purchasing
                    ? "Processing..."
                    : `Confirm Purchase — ৳${selectedPlan.price}`}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
};

export default DiningPage;
