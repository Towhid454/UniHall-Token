import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AppShell from "../../components/layout/AppShell";
import { SkeletonGrid } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function HallFeePage() {
  const [fees, setFees] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);

  const fetchAll = async () => {
    try {
      const [feesRes, walletRes] = await Promise.all([
        api.get("/hall-fee/me"),
        api.get("/wallet/me"),
      ]);
      setFees(feesRes.data.data || []);
      setWallet(walletRes.data.data?.wallet);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load hall fee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    const amount = Number(payAmount);
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    setPaying(true);
    try {
      await api.post("/hall-fee/pay", { feeId: showPayModal._id, amount });
      toast.success("Payment successful");
      setShowPayModal(null);
      setPayAmount("");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <AppShell>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#1F2D3D",
          marginBottom: "20px",
        }}
      >
        Hall Fee
      </h1>

      {loading ? (
        <SkeletonGrid count={2} minWidth="320px" />
      ) : fees.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <EmptyState icon="💳" title="No hall fee assigned yet" />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {fees.map((fee) => {
            const dueAmount = fee.totalAmount - fee.paidAmount;
            return (
              <motion.div
                key={fee._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "linear-gradient(135deg, #3B6FE0, #6FA8FF)",
                  borderRadius: "20px",
                  padding: "24px",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "13px", opacity: 0.85 }}>
                  {fee.title}
                </div>
                <div
                  style={{ fontSize: "13px", opacity: 0.85, marginTop: "8px" }}
                >
                  Due Amount
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    marginBottom: "12px",
                  }}
                >
                  ৳{dueAmount}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    opacity: 0.9,
                    marginBottom: "16px",
                  }}
                >
                  <span>
                    Paid: ৳{fee.paidAmount} / ৳{fee.totalAmount}
                  </span>
                  <span
                    style={{
                      background:
                        fee.status === "paid" ? "#2ECC7133" : "#E74C3C33",
                      borderRadius: "20px",
                      padding: "3px 12px",
                      fontWeight: 700,
                    }}
                  >
                    {fee.status.toUpperCase()}
                  </span>
                </div>
                {fee.status !== "paid" && (
                  <button
                    onClick={() => {
                      setShowPayModal(fee);
                      setPayAmount(String(dueAmount));
                    }}
                    style={{
                      width: "100%",
                      background: "white",
                      color: "#3B6FE0",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Pay Now
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showPayModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 50,
            }}
            onClick={() => setShowPayModal(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "24px 24px 0 0",
                padding: "24px",
                width: "100%",
                maxWidth: "480px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "6px",
                  color: "#1F2D3D",
                }}
              >
                Pay Hall Fee
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "16px",
                }}
              >
                {showPayModal.title} · Wallet balance: ৳
                {wallet?.balance?.toFixed(2) || "0.00"}
              </p>
              <form onSubmit={handlePay}>
                <input
                  required
                  type="number"
                  min="1"
                  max={showPayModal.totalAmount - showPayModal.paidAmount}
                  placeholder="Amount"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                    marginBottom: "12px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  disabled={paying}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #3B6FE0, #6FA8FF)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {paying ? "Processing..." : "Confirm Payment"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
