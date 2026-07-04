const express = require("express");
const router = express.Router();
const {
  hallAdminDashboard,
  getHallStudents,
  updateStudentStatus,
  getHallRooms,
  updateDiningPlan,
  getTokenUsageReport,
  universityAdminDashboard,
  getUniversityHalls,
  createHallByUniversityAdmin,
  assignHallAdmin,
  getCrossHallReport,
  superAdminDashboard,
  getAllUniversitiesAdmin,
  onboardUniversity,
  updateUniversityStatus,
  assignUniversityAdmin,
  getAllUsers,
} = require("../controllers/admin.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.use(protect);

// ── Hall Admin routes (/api/hall-admin/...)
router.get(
  "/hall-admin/dashboard",
  restrictTo("hallAdmin"),
  hallAdminDashboard,
);
router.get("/hall-admin/students", restrictTo("hallAdmin"), getHallStudents);
router.patch(
  "/hall-admin/students/:id/status",
  restrictTo("hallAdmin"),
  updateStudentStatus,
);
router.get("/hall-admin/rooms", restrictTo("hallAdmin"), getHallRooms);
router.patch(
  "/hall-admin/dining/plans/:id",
  restrictTo("hallAdmin"),
  updateDiningPlan,
);
router.get(
  "/hall-admin/tokens/usage",
  restrictTo("hallAdmin"),
  getTokenUsageReport,
);

// ── University Admin routes (/api/university-admin/...)
router.get(
  "/university-admin/dashboard",
  restrictTo("universityAdmin"),
  universityAdminDashboard,
);
router.get(
  "/university-admin/halls",
  restrictTo("universityAdmin"),
  getUniversityHalls,
);
router.post(
  "/university-admin/halls",
  restrictTo("universityAdmin"),
  createHallByUniversityAdmin,
);
router.post(
  "/university-admin/halls/:hallId/assign-admin",
  restrictTo("universityAdmin"),
  assignHallAdmin,
);
router.get(
  "/university-admin/cross-hall-report",
  restrictTo("universityAdmin"),
  getCrossHallReport,
);

// ── Super Admin routes (/api/super-admin/...)
router.get(
  "/super-admin/dashboard",
  restrictTo("superAdmin"),
  superAdminDashboard,
);
router.get(
  "/super-admin/universities",
  restrictTo("superAdmin"),
  getAllUniversitiesAdmin,
);
router.post(
  "/super-admin/universities",
  restrictTo("superAdmin"),
  onboardUniversity,
);
router.patch(
  "/super-admin/universities/:id/status",
  restrictTo("superAdmin"),
  updateUniversityStatus,
);
router.post(
  "/super-admin/assign-university-admin",
  restrictTo("superAdmin"),
  assignUniversityAdmin,
);
router.get("/super-admin/users", restrictTo("superAdmin"), getAllUsers);

module.exports = router;
