import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/layout/AppShell";
import api from "../../api/axios";

const Section = ({ icon, title, gradient, children, onUpdate }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: "white",
      borderRadius: "20px",
      overflow: "hidden",
      marginBottom: "14px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.05)",
    }}
  >
    {/* Section Header */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 18px",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          {icon}
        </div>
        <span style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>
          {title}
        </span>
      </div>
      {onUpdate && (
        <button
          onClick={onUpdate}
          style={{
            background: "rgba(13,148,136,0.1)",
            border: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            color: "#0d9488",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Update
        </button>
      )}
    </div>
    <div style={{ padding: "16px 18px" }}>{children}</div>
  </motion.div>
);

const InfoRow = ({ icon, label, value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "9px 0",
      borderBottom: "1px solid #f8fafc",
    }}
  >
    <span style={{ fontSize: "16px", marginRight: "10px", width: "24px" }}>
      {icon}
    </span>
    <span style={{ color: "#64748b", fontSize: "13px", flex: 1 }}>{label}</span>
    <span
      style={{
        color: value && value !== "Not provided" ? "#0f172a" : "#cbd5e1",
        fontSize: "13px",
        fontWeight: value && value !== "Not provided" ? "600" : "400",
        textAlign: "right",
        maxWidth: "55%",
      }}
    >
      {value || "Not provided"}
    </span>
  </div>
);

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["male", "female", "other"];

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/students/me");
      setProfile(res.data.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openEdit = (section, initialData) => {
    setForm(initialData);
    setEditModal(section);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch("/students/me", form);
      setProfile(res.data.data);
      toast.success("Profile updated!");
      setEditModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = "text", options }) => (
    <div style={{ marginBottom: "12px" }}>
      <label
        style={{
          fontSize: "12px",
          color: "#64748b",
          fontWeight: "600",
          display: "block",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {options ? (
        <select
          value={form[name] || ""}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          style={fieldStyle}
        >
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={form[name] || ""}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          placeholder={`Enter ${label}`}
          style={fieldStyle}
        />
      )}
    </div>
  );

  const AddressField = ({ prefix, label }) => (
    <div style={{ marginBottom: "12px" }}>
      <label
        style={{
          fontSize: "12px",
          color: "#64748b",
          fontWeight: "600",
          display: "block",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {["division", "district", "upazila", "postcode", "details"].map((k) => (
        <input
          key={k}
          placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
          value={form[prefix]?.[k] || ""}
          onChange={(e) =>
            setForm({
              ...form,
              [prefix]: { ...form[prefix], [k]: e.target.value },
            })
          }
          style={{ ...fieldStyle, marginBottom: "6px" }}
        />
      ))}
    </div>
  );

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

  const p = profile || {};
  const present = p.presentAddress || {};
  const permanent = p.permanentAddress || {};

  return (
    <AppShell>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left Column — Avatar + Hall Info */}
        <div>
          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg, #0f766e, #0d9488)",
              borderRadius: "24px",
              padding: "28px 20px",
              textAlign: "center",
              marginBottom: "16px",
              boxShadow: "0 8px 24px rgba(13,148,136,0.3)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "900",
                color: "white",
                border: "3px solid rgba(255,255,255,0.4)",
              }}
            >
              {p.name?.charAt(0).toUpperCase()}
            </div>
            <div
              style={{ color: "white", fontSize: "20px", fontWeight: "700" }}
            >
              {p.name?.toUpperCase()}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              {p.studentId ? `🪪 ${p.studentId}` : "ID not set"}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
              {[p.department, `Batch ${p.batch}`, "Hall Resident"]
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "20px",
                      padding: "4px 10px",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </motion.div>

          {/* Hall Info */}
          <Section
            icon="🏢"
            title="Hall Information"
            gradient="linear-gradient(135deg, #f59e0b, #d97706)"
          >
            <InfoRow icon="🏛️" label="University" value={p.university?.name} />
            <InfoRow icon="🏠" label="Hall Name" value={p.hall?.name} />
            <InfoRow icon="📧" label="Email" value={p.email} />
            <div style={{ marginTop: "10px" }}>
              <span
                style={{
                  background:
                    p.status === "active"
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(239,68,68,0.1)",
                  color: p.status === "active" ? "#10b981" : "#ef4444",
                  border: `1px solid ${p.status === "active" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                ● {(p.status || "active").toUpperCase()}
              </span>
            </div>
          </Section>
        </div>

        {/* Right Column — Info Sections */}
        <div>
          <Section
            icon="🎓"
            title="Academic Information"
            gradient="linear-gradient(135deg, #0d9488, #0f766e)"
            onUpdate={() =>
              openEdit("academic", {
                studentId: p.studentId,
                department: p.department,
                batch: p.batch,
                session: p.session,
                program: p.program,
              })
            }
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0",
              }}
            >
              <InfoRow icon="#️⃣" label="Roll Number" value={p.studentId} />
              <InfoRow icon="📅" label="Session" value={p.session} />
              <InfoRow icon="🏛️" label="Department" value={p.department} />
              <InfoRow icon="📖" label="Program" value={p.program} />
              <InfoRow icon="👥" label="Batch" value={p.batch} />
            </div>
          </Section>

          <Section
            icon="👤"
            title="Personal Information"
            gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
            onUpdate={() =>
              openEdit("personal", {
                gender: p.gender,
                bloodGroup: p.bloodGroup,
                religion: p.religion,
                nationality: p.nationality,
                nationalId: p.nationalId,
                phone: p.phone,
                dob: p.dob ? p.dob.split("T")[0] : "",
              })
            }
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0",
              }}
            >
              <InfoRow
                icon="🎂"
                label="Date of Birth"
                value={p.dob ? new Date(p.dob).toLocaleDateString() : null}
              />
              <InfoRow icon="⚧" label="Gender" value={p.gender} />
              <InfoRow icon="🩸" label="Blood Group" value={p.bloodGroup} />
              <InfoRow icon="🕌" label="Religion" value={p.religion} />
              <InfoRow icon="🏳️" label="Nationality" value={p.nationality} />
              <InfoRow icon="🪪" label="National ID" value={p.nationalId} />
              <InfoRow icon="📞" label="Phone" value={p.phone} />
            </div>
          </Section>

          <Section
            icon="📍"
            title="Address Information"
            gradient="linear-gradient(135deg, #ef4444, #dc2626)"
            onUpdate={() =>
              openEdit("address", {
                presentAddress: { ...present },
                permanentAddress: { ...permanent },
              })
            }
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#0d9488",
                    marginBottom: "8px",
                  }}
                >
                  🏠 Present Address
                </div>
                {["division", "district", "upazila", "postcode"].map((k) => (
                  <InfoRow
                    key={k}
                    icon="📌"
                    label={k.charAt(0).toUpperCase() + k.slice(1)}
                    value={present[k]}
                  />
                ))}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#6366f1",
                    marginBottom: "8px",
                  }}
                >
                  🏡 Permanent Address
                </div>
                {["division", "district", "upazila", "postcode"].map((k) => (
                  <InfoRow
                    key={k}
                    icon="📌"
                    label={k.charAt(0).toUpperCase() + k.slice(1)}
                    value={permanent[k]}
                  />
                ))}
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setEditModal(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "24px 24px 0 0",
              padding: "24px 20px 40px",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
            }}
          >
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
                  fontWeight: "700",
                  fontSize: "17px",
                  color: "#0f172a",
                }}
              >
                Update {editModal.charAt(0).toUpperCase() + editModal.slice(1)}{" "}
                Info
              </span>
              <button
                onClick={() => setEditModal(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>

            {editModal === "academic" && (
              <>
                <Field label="Student ID / Roll" name="studentId" />
                <Field label="Department" name="department" />
                <Field label="Batch" name="batch" />
                <Field label="Session" name="session" />
                <Field label="Program" name="program" />
              </>
            )}

            {editModal === "personal" && (
              <>
                <Field label="Date of Birth" name="dob" type="date" />
                <Field label="Gender" name="gender" options={GENDERS} />
                <Field
                  label="Blood Group"
                  name="bloodGroup"
                  options={BLOOD_GROUPS}
                />
                <Field label="Religion" name="religion" />
                <Field label="Nationality" name="nationality" />
                <Field label="National ID" name="nationalId" />
                <Field label="Phone" name="phone" type="tel" />
              </>
            )}

            {editModal === "address" && (
              <>
                <AddressField prefix="presentAddress" label="Present Address" />
                <AddressField
                  prefix="permanentAddress"
                  label="Permanent Address"
                />
              </>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "15px",
                fontWeight: "700",
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(13,148,136,0.35)",
                opacity: saving ? 0.8 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
};

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "13px",
  color: "#0f172a",
  outline: "none",
};

export default ProfilePage;
