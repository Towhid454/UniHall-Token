import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";
import { SkeletonGrid } from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";

const HALL_ADMIN_TABS = [
  { path: "/admin/hall", icon: "📊", label: "Dashboard" },
  { path: "/admin/hall/allotments", icon: "🚪", label: "Allotments" },
  { path: "/admin/hall/students", icon: "👥", label: "Students" },
  { path: "/admin/hall/dining", icon: "🍽️", label: "Dining" },
  { path: "/admin/hall/fees", icon: "💳", label: "Fees" },
  { path: "/admin/hall/rooms", icon: "🛏️", label: "Rooms" },
  { path: "/admin/hall/tickets", icon: "🎧", label: "Tickets" },
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  durationDays: "",
  lunch: true,
  dinner: true,
};

export default function HallDining() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/dining/hall-plans");
      setPlans(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load dining plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/dining/plans", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        durationDays: Number(form.durationDays),
        mealsPerDay: { lunch: form.lunch, dinner: form.dinner },
      });
      toast.success("Dining plan created");
      setShowCreateModal(false);
      setForm(emptyForm);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create plan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (plan) => {
    const newStatus = plan.status === "active" ? "inactive" : "active";
    try {
      await api.patch(`/hall-admin/dining/plans/${plan._id}`, {
        status: newStatus,
      });
      toast.success(`Plan ${newStatus === "active" ? "reopened" : "closed"}`);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update plan");
    }
  };

  return (
    <AdminShell tabs={HALL_ADMIN_TABS} title="Hall Admin">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2D3D" }}>
          Dining Plans
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "linear-gradient(135deg, #F08A3C, #FFB36B)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Create Dining Plan
        </button>
      </div>

      {loading ? (
        <SkeletonGrid count={4} minWidth="280px" />
      ) : plans.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <EmptyState
            icon="🍽️"
            title="No dining plans yet"
            subtitle="Create one so students can purchase tokens."
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan._id}
              style={{
                background: "white",
                borderRadius: "18px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: "18px",
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
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#1F2D3D",
                    }}
                  >
                    {plan.name}
                  </div>
                  {plan.description && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        marginTop: "2px",
                      }}
                    >
                      {plan.description}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    background:
                      plan.status === "active" ? "#2ECC7122" : "#E74C3C22",
                    color: plan.status === "active" ? "#2ECC71" : "#E74C3C",
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {plan.status.toUpperCase()}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "#374151",
                }}
              >
                <div>৳{plan.price}</div>
                <div>{plan.durationDays} days</div>
              </div>
              <div
                style={{ fontSize: "12px", color: "#6B7280", marginTop: "6px" }}
              >
                {plan.mealsPerDay?.lunch && "Lunch"}{" "}
                {plan.mealsPerDay?.lunch && plan.mealsPerDay?.dinner && "+"}{" "}
                {plan.mealsPerDay?.dinner && "Dinner"}
              </div>

              <button
                onClick={() => handleToggleStatus(plan)}
                style={{
                  marginTop: "14px",
                  width: "100%",
                  background: plan.status === "active" ? "#FEF2F2" : "#F0FDF4",
                  border: `1px solid ${plan.status === "active" ? "#E74C3C" : "#2ECC71"}`,
                  color: plan.status === "active" ? "#E74C3C" : "#2ECC71",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {plan.status === "active" ? "Close Plan" : "Reopen Plan"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
            onClick={() => setShowCreateModal(false)}
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
                maxHeight: "85vh",
                overflowY: "auto",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#1F2D3D",
                }}
              >
                Create Dining Plan
              </h2>
              <form onSubmit={handleCreate}>
                <input
                  required
                  placeholder="Name (e.g. June-July First 15 days)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  style={inputStyle}
                />
                <input
                  required
                  type="number"
                  placeholder="Price (৳)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  style={inputStyle}
                />
                <input
                  required
                  type="number"
                  placeholder="Duration (days)"
                  value={form.durationDays}
                  onChange={(e) =>
                    setForm({ ...form, durationDays: e.target.value })
                  }
                  style={inputStyle}
                />
                <div
                  style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.lunch}
                      onChange={(e) =>
                        setForm({ ...form, lunch: e.target.checked })
                      }
                    />
                    Lunch
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.dinner}
                      onChange={(e) =>
                        setForm({ ...form, dinner: e.target.checked })
                      }
                    />
                    Dinner
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #F08A3C, #FFB36B)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Creating..." : "Create Plan"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  marginBottom: "12px",
  fontSize: "14px",
  boxSizing: "border-box",
};
