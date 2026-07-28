import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AppShell from "../../components/layout/AppShell";
import api from "../../api/axios";
import { SkeletonBox } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

const TX_ICONS = {
  deposit: {
    icon: "⬇️",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    label: "Deposit",
  },
  debit: {
    icon: "⬆️",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    label: "Debit",
  },
};

const WalletPageSkeleton = () => (
  <div>
    <SkeletonBox
      height="180px"
      radius="24px"
      style={{ marginBottom: "16px" }}
    />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <SkeletonBox height="100px" radius="16px" />
      <SkeletonBox height="100px" radius="16px" />
    </div>
    <SkeletonBox height="15px" width="150px" style={{ marginBottom: "12px" }} />
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderBottom: i < 3 ? "1px solid #f1f5f9" : "none",
          }}
        >
          <SkeletonBox width="40px" height="40px" radius="12px" />
          <div style={{ flex: 1 }}>
            <SkeletonBox
              height="13px"
              width="60%"
              style={{ marginBottom: "6px" }}
            />
            <SkeletonBox height="11px" width="40%" />
          </div>
          <SkeletonBox width="60px" height="14px" />
        </div>
      ))}
    </div>
  </div>
);

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState("");
  const [depositing, setDepositing] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/wallet/me");
      setWallet(res.data.data.wallet);
      setTransactions(res.data.data.transactions || []);
    } catch {
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > 50000) return toast.error("Max deposit is ৳50,000");
    setDepositing(true);
    try {
      const res = await api.post("/wallet/deposit", { amount: amt });
      toast.success(`৳${amt} deposited successfully!`);
      setWallet((prev) => ({ ...prev, balance: res.data.data.balance }));
      setAmount("");
      setShowDeposit(false);
      fetchWallet();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deposit failed");
    } finally {
      setDepositing(false);
    }
  };

  const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

  if (loading)
    return (
      <AppShell>
        <WalletPageSkeleton />
      </AppShell>
    );

  return (
    <AppShell>
      <div>
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background:
              "linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #6366f1 100%)",
            borderRadius: "24px",
            padding: "28px 24px",
            marginBottom: "16px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 12px 32px rgba(59,130,246,0.35)",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              right: "-30px",
              top: "-30px",
              width: "130px",
              height: "130px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "40px",
              bottom: "-40px",
              width: "100px",
              height: "100px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "13px",
                marginBottom: "6px",
              }}
            >
              💳 My Wallet
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
              Current Balance
            </div>
            <div
              style={{
                color: "white",
                fontSize: "36px",
                fontWeight: "900",
                margin: "6px 0 16px",
                letterSpacing: "-1px",
              }}
            >
              ৳{(wallet?.balance || 0).toFixed(2)}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowDeposit(true)}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: "12px",
                  padding: "11px",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                ⬇️ Deposit
              </button>
              <button
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "11px",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "not-allowed",
                }}
              >
                ⬆️ Withdraw
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            {
              label: "Total Deposited",
              value: `৳${transactions
                .filter((t) => t.type === "deposit")
                .reduce((s, t) => s + t.amount, 0)
                .toFixed(2)}`,
              icon: "📥",
              color: "#10b981",
              bg: "rgba(16,185,129,0.08)",
            },
            {
              label: "Total Spent",
              value: `৳${transactions
                .filter((t) => t.type === "debit")
                .reduce((s, t) => s + t.amount, 0)
                .toFixed(2)}`,
              icon: "📤",
              color: "#ef4444",
              bg: "rgba(239,68,68,0.08)",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: stat.bg,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "800",
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transaction History */}
        <div
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#0f172a",
            marginBottom: "12px",
          }}
        >
          Recent Transactions
        </div>

        {transactions.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <EmptyState
              icon="💳"
              title="No transactions yet"
              subtitle="Your transaction history will appear here"
            />
          </div>
        ) : (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {transactions.map((tx, i) => {
              const info = TX_ICONS[tx.type] || TX_ICONS.debit;
              const date = new Date(tx.createdAt);
              return (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    borderBottom:
                      i < transactions.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      flexShrink: 0,
                      background: info.bg,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    {info.icon}
                  </div>

                  {/* Description */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tx.description || info.label}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        marginTop: "2px",
                      }}
                    >
                      {date.toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {date.toLocaleTimeString("en-BD", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Amount */}
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "800",
                      color: tx.type === "deposit" ? "#10b981" : "#ef4444",
                      flexShrink: 0,
                    }}
                  >
                    {tx.type === "deposit" ? "+" : "-"}৳{tx.amount.toFixed(2)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDeposit && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onClick={() => setShowDeposit(false)}
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
                padding: "24px 20px 48px",
                width: "100%",
                maxWidth: "480px",
              }}
            >
              {/* Handle */}
              <div
                style={{
                  width: "36px",
                  height: "4px",
                  background: "#e2e8f0",
                  borderRadius: "9999px",
                  margin: "0 auto 20px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "18px",
                    color: "#0f172a",
                  }}
                >
                  ⬇️ Deposit Money
                </span>
                <button
                  onClick={() => setShowDeposit(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Current Balance */}
              <div
                style={{
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  Current Balance
                </span>
                <span
                  style={{
                    color: "#3b82f6",
                    fontWeight: "800",
                    fontSize: "16px",
                  }}
                >
                  ৳{(wallet?.balance || 0).toFixed(2)}
                </span>
              </div>

              {/* Amount Input */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Enter Amount (৳)
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#0d9488",
                    }}
                  >
                    ৳
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max="50000"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px 14px 14px 34px",
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#0f172a",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
              </div>

              {/* Quick Amounts */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    style={{
                      background:
                        amount == q ? "rgba(13,148,136,0.1)" : "#f8fafc",
                      border: `1.5px solid ${amount == q ? "#0d9488" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      padding: "10px 4px",
                      color: amount == q ? "#0d9488" : "#64748b",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    ৳{q >= 1000 ? `${q / 1000}k` : q}
                  </button>
                ))}
              </div>

              <button
                onClick={handleDeposit}
                disabled={depositing || !amount}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: amount
                    ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                    : "#e2e8f0",
                  border: "none",
                  borderRadius: "14px",
                  color: amount ? "white" : "#94a3b8",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: amount && !depositing ? "pointer" : "not-allowed",
                  boxShadow: amount
                    ? "0 4px 16px rgba(59,130,246,0.35)"
                    : "none",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {depositing ? (
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
                ) : amount ? (
                  `Deposit ৳${Number(amount).toFixed(2)}`
                ) : (
                  "Enter an amount"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
};

export default WalletPage;
