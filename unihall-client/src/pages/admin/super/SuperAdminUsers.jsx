import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import AdminShell from "../../../components/layout/AdminShell";

const SUPER_ADMIN_TABS = [
  { path: "/admin/super", icon: "📊", label: "Dashboard" },
  { path: "/admin/super/universities", icon: "🏫", label: "Universities" },
  { path: "/admin/super/users", icon: "👤", label: "Users" },
];

const ROLE_FILTERS = [
  "all",
  "student",
  "hallAdmin",
  "universityAdmin",
  "superAdmin",
];

const roleBadgeColor = {
  student: "#0d9488",
  hallAdmin: "#6366f1",
  universityAdmin: "#3B6FE0",
  superAdmin: "#7B4FE0",
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/super-admin/users");
        setUsers(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <AdminShell tabs={SUPER_ADMIN_TABS} title="Super Admin">
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#1F2D3D",
          marginBottom: "16px",
        }}
      >
        All Users
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            fontSize: "14px",
          }}
        />
        {ROLE_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{
              background: roleFilter === r ? "#0d9488" : "#F7FAF9",
              color: roleFilter === r ? "white" : "#6B7280",
              border: "none",
              borderRadius: "10px",
              padding: "9px 14px",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {r === "all" ? "All" : r}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "#6B7280" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}
        >
          No users found.
        </div>
      ) : (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F7FAF9", textAlign: "left" }}>
                {["Name", "Email", "Role", "University", "Hall", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#6B7280",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} style={{ borderTop: "1px solid #F0F0F0" }}>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: 600,
                      color: "#1F2D3D",
                    }}
                  >
                    {u.name}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        background: `${roleBadgeColor[u.role]}22`,
                        color: roleBadgeColor[u.role],
                        borderRadius: "20px",
                        padding: "3px 10px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280" }}>
                    {u.university?.name || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280" }}>
                    {u.hall?.name || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280" }}>
                    {u.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
