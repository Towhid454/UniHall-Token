export const roleHomeRoutes = {
  student: "/dashboard",
  hallAdmin: "/admin/hall",
  universityAdmin: "/admin/university",
  superAdmin: "/admin/super",
};

export const getRoleHome = (role) => roleHomeRoutes[role] || "/login";
