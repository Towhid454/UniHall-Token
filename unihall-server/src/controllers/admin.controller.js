const crypto = require("crypto");
const User = require("../models/User.model");
const Hall = require("../models/Hall.model");
const University = require("../models/University.model");
const RoomAllotment = require("../models/RoomAllotment.model");
const Room = require("../models/Room.model");
const DiningPlan = require("../models/DiningPlan.model");
const Token = require("../models/Token.model");
const SupportTicket = require("../models/SupportTicket.model");
const Feedback = require("../models/Feedback.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─── HALL ADMIN ───────────────────────────────────────────

// GET /api/hall-admin/dashboard
const hallAdminDashboard = asyncHandler(async (req, res) => {
  const hallId = req.user.hall;

  const [
    totalStudents,
    totalRooms,
    pendingAllotments,
    pendingTickets,
    totalDiningPlans,
  ] = await Promise.all([
    User.countDocuments({ hall: hallId, role: "student", status: "active" }),
    Room.countDocuments({ hall: hallId }),
    RoomAllotment.countDocuments({ hall: hallId, status: "pending" }),
    SupportTicket.countDocuments({ hall: hallId, status: "pending" }),
    DiningPlan.countDocuments({ hall: hallId, status: "active" }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalStudents,
        totalRooms,
        pendingAllotments,
        pendingTickets,
        totalDiningPlans,
      },
      "Hall admin dashboard",
    ),
  );
});

// GET /api/hall-admin/students — all students in this hall
const getHallStudents = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = { hall: req.user.hall, role: "student" };
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { studentId: { $regex: search, $options: "i" } },
    ];
  }

  const students = await User.find(filter)
    .select("-password -refreshToken")
    .sort("name");

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched"));
});

// PATCH /api/hall-admin/students/:id/status — suspend/activate a student
const updateStudentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive", "suspended"].includes(status)) {
    throw new ApiError(400, "status must be active | inactive | suspended");
  }

  const student = await User.findOne({
    _id: id,
    hall: req.user.hall,
    role: "student",
  });
  if (!student) throw new ApiError(404, "Student not found in your hall");

  student.status = status;
  await student.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { _id: student._id, status: student.status },
        "Student status updated",
      ),
    );
});

// GET /api/hall-admin/rooms — all rooms with occupancy info
const getHallRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ hall: req.user.hall })
    .populate("occupants", "name email studentId")
    .sort("roomNumber");

  return res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched"));
});

// PATCH /api/hall-admin/dining/plans/:id — update dining plan
const updateDiningPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, durationDays, mealsPerDay, status } =
    req.body;

  const plan = await DiningPlan.findOne({ _id: id, hall: req.user.hall });
  if (!plan) throw new ApiError(404, "Dining plan not found");

  if (name) plan.name = name;
  if (description) plan.description = description;
  if (price) plan.price = price;
  if (durationDays) plan.durationDays = durationDays;
  if (mealsPerDay) plan.mealsPerDay = mealsPerDay;
  if (status) plan.status = status;

  await plan.save();

  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Dining plan updated"));
});

// GET /api/hall-admin/tokens/usage — token usage report
const getTokenUsageReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const filter = { hall: req.user.hall };

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const report = await Token.aggregate([
    { $match: { hall: req.user.hall } },
    {
      $group: {
        _id: { status: "$status", mealType: "$mealType" },
        count: { $sum: 1 },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Token usage report"));
});

// ─── UNIVERSITY ADMIN ─────────────────────────────────────

// GET /api/university-admin/dashboard
const universityAdminDashboard = asyncHandler(async (req, res) => {
  const universityId = req.user.university;

  const halls = await Hall.find({ university: universityId });
  const hallIds = halls.map((h) => h._id);

  const [
    totalHalls,
    totalStudents,
    totalHallAdmins,
    pendingAllotments,
    pendingTickets,
  ] = await Promise.all([
    Hall.countDocuments({ university: universityId }),
    User.countDocuments({
      university: universityId,
      role: "student",
      status: "active",
    }),
    User.countDocuments({ university: universityId, role: "hallAdmin" }),
    RoomAllotment.countDocuments({
      hall: { $in: hallIds },
      status: "pending",
    }),
    SupportTicket.countDocuments({
      hall: { $in: hallIds },
      status: "pending",
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalHalls,
        totalStudents,
        totalHallAdmins,
        pendingAllotments,
        pendingTickets,
        halls: halls.map((h) => ({
          _id: h._id,
          name: h.name,
          code: h.code,
          status: h.status,
        })),
      },
      "University admin dashboard",
    ),
  );
});

// GET /api/university-admin/halls — all halls under this university, with assigned admin info
const getUniversityHalls = asyncHandler(async (req, res) => {
  const halls = await Hall.find({ university: req.user.university }).lean();
  const hallIds = halls.map((h) => h._id);

  // Hall model has no hallAdmin field — admin is tracked on the User side
  // (user.hall = hallId, user.role = "hallAdmin"). So we look it up separately
  // and attach it to each hall for the frontend.
  const hallAdmins = await User.find({
    hall: { $in: hallIds },
    role: "hallAdmin",
  }).select("name email hall");

  const adminByHall = {};
  hallAdmins.forEach((admin) => {
    adminByHall[admin.hall.toString()] = {
      name: admin.name,
      email: admin.email,
    };
  });

  const hallsWithAdmin = halls.map((h) => ({
    ...h,
    hallAdmin: adminByHall[h._id.toString()] || null,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, hallsWithAdmin, "Halls fetched"));
});

// POST /api/university-admin/halls — create a new hall
const createHallByUniversityAdmin = asyncHandler(async (req, res) => {
  const { name, code, totalRooms, provostName, address } = req.body;

  if (!name || !code) throw new ApiError(400, "name and code are required");

  const existing = await Hall.findOne({
    university: req.user.university,
    code: code.toUpperCase(),
  });
  if (existing) throw new ApiError(409, "Hall with this code already exists");

  const hall = await Hall.create({
    university: req.user.university,
    name,
    code,
    totalRooms,
    provostName,
    address,
  });

  return res.status(201).json(new ApiResponse(201, hall, "Hall created"));
});

// POST /api/university-admin/halls/:hallId/assign-admin — assign hallAdmin
// If the email doesn't belong to an existing user, a new account is created
// and immediately marked emailVerified (the universityAdmin is vouching for
// this person directly, so no email verification link is needed). The new
// account gets a random password — the admin should use "Forgot Password"
// to set their own on first login.
const assignHallAdmin = asyncHandler(async (req, res) => {
  const { hallId } = req.params;
  const { email, name } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) throw new ApiError(400, "email is required");

  // Verify hall belongs to this university
  const hall = await Hall.findOne({
    _id: hallId,
    university: req.user.university,
  });
  if (!hall) throw new ApiError(404, "Hall not found under your university");

  let user = await User.findOne({ email: normalizedEmail });
  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    const tempPassword = crypto.randomBytes(9).toString("base64url");
    user = await User.create({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: tempPassword,
      role: "hallAdmin",
      university: req.user.university,
      hall: hallId,
      emailVerified: true, // admin assigned directly by universityAdmin — no email link needed
      status: "active",
    });
  } else {
    user.role = "hallAdmin";
    user.hall = hallId;
    user.university = req.user.university;
    user.emailVerified = true;
    await user.save();
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hall: user.hall,
        isNewUser,
      },
      isNewUser
        ? `New account created and assigned as Hall Admin for ${hall.name}. Ask them to use "Forgot Password" to set their own password.`
        : `${user.name} assigned as Hall Admin for ${hall.name}`,
    ),
  );
});

// GET /api/university-admin/cross-hall-report — cross-hall stats
const getCrossHallReport = asyncHandler(async (req, res) => {
  const universityId = req.user.university;
  const halls = await Hall.find({ university: universityId });

  const report = await Promise.all(
    halls.map(async (hall) => {
      const [
        totalStudents,
        rooms,
        pendingAllotments,
        pendingTickets,
        feedbacks,
      ] = await Promise.all([
        User.countDocuments({
          hall: hall._id,
          role: "student",
          status: "active",
        }),
        Room.find({ hall: hall._id }).select("capacity occupants"),
        RoomAllotment.countDocuments({ hall: hall._id, status: "pending" }),
        SupportTicket.countDocuments({ hall: hall._id, status: "pending" }),
        Feedback.find({ hall: hall._id, rating: { $gt: 0 } }).select("rating"),
      ]);

      const totalCapacity = rooms.reduce((s, r) => s + (r.capacity || 0), 0);
      const totalOccupied = rooms.reduce(
        (s, r) => s + (r.occupants?.length || 0),
        0,
      );
      const occupancyRate =
        totalCapacity > 0
          ? Math.round((totalOccupied / totalCapacity) * 100)
          : null;

      const avgFeedbackRating = feedbacks.length
        ? Number(
            (
              feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length
            ).toFixed(1),
          )
        : null;

      return {
        hallId: hall._id,
        hallName: hall.name,
        totalStudents,
        occupancyRate,
        pendingAllotments,
        pendingTickets,
        avgFeedbackRating,
      };
    }),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Cross-hall report"));
});

// ─── SUPER ADMIN ──────────────────────────────────────────

// GET /api/super-admin/dashboard
const superAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUniversities,
    totalHalls,
    totalStudents,
    totalHallAdmins,
    totalUniversityAdmins,
  ] = await Promise.all([
    University.countDocuments(),
    Hall.countDocuments(),
    User.countDocuments({ role: "student", status: "active" }),
    User.countDocuments({ role: "hallAdmin" }),
    User.countDocuments({ role: "universityAdmin" }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUniversities,
        totalHalls,
        totalStudents,
        totalHallAdmins,
        totalUniversityAdmins,
      },
      "Super admin dashboard",
    ),
  );
});

// GET /api/super-admin/universities — all universities, with assigned admin info
const getAllUniversitiesAdmin = asyncHandler(async (req, res) => {
  const universities = await University.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const universityIds = universities.map((u) => u._id);

  // University model has no universityAdmin field — admin is tracked on the
  // User side (user.university = universityId, user.role = "universityAdmin").
  // Look it up separately and attach to each university for the frontend.
  const uniAdmins = await User.find({
    university: { $in: universityIds },
    role: "universityAdmin",
  }).select("name email university");

  const adminByUniversity = {};
  uniAdmins.forEach((admin) => {
    adminByUniversity[admin.university.toString()] = {
      name: admin.name,
      email: admin.email,
    };
  });

  const universitiesWithAdmin = universities.map((u) => ({
    ...u,
    universityAdmin: adminByUniversity[u._id.toString()] || null,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, universitiesWithAdmin, "All universities"));
});

// GET /api/super-admin/universities/:id — university detail + its halls with summary
const getUniversityDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const university = await University.findById(id).populate(
    "createdBy",
    "name email",
  );
  if (!university) throw new ApiError(404, "University not found");

  const halls = await Hall.aggregate([
    { $match: { university: university._id } },
    {
      $lookup: {
        from: "users",
        let: { hallId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$hall", "$$hallId"] },
                  { $eq: ["$role", "student"] },
                  { $eq: ["$status", "active"] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "studentCount",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { hallId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$hall", "$$hallId"] },
                  { $eq: ["$role", "hallAdmin"] },
                ],
              },
            },
          },
          { $project: { name: 1, email: 1 } },
        ],
        as: "hallAdmins",
      },
    },
    {
      $project: {
        name: 1,
        code: 1,
        status: 1,
        totalRooms: 1,
        studentCount: {
          $ifNull: [{ $arrayElemAt: ["$studentCount.count", 0] }, 0],
        },
        hallAdmins: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { university, halls }, "University detail fetched"),
    );
});

// GET /api/super-admin/halls/:id — hall detail + student count + occupancy
const getHallDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hall = await Hall.findById(id).populate("university", "name code");
  if (!hall) throw new ApiError(404, "Hall not found");

  const [studentCount, hallAdmins, rooms] = await Promise.all([
    User.countDocuments({ hall: id, role: "student", status: "active" }),
    User.find({ hall: id, role: "hallAdmin" }).select("name email"),
    Room.find({ hall: id }).select("roomNumber capacity occupants"),
  ]);

  const totalCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
  const totalOccupied = rooms.reduce(
    (sum, r) => sum + (r.occupants?.length || 0),
    0,
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hall,
        studentCount,
        hallAdmins,
        roomCount: rooms.length,
        totalCapacity,
        totalOccupied,
      },
      "Hall detail fetched",
    ),
  );
});

// POST /api/super-admin/universities — onboard a new university
const onboardUniversity = asyncHandler(async (req, res) => {
  const { name, shortName, code, emailDomain, logoUrl, address, website } =
    req.body;

  if (!name || !shortName || !code || !emailDomain) {
    throw new ApiError(400, "name, shortName, code, emailDomain are required");
  }

  const existing = await University.findOne({ code: code.toUpperCase() });
  if (existing) throw new ApiError(409, "University code already exists");

  const university = await University.create({
    name,
    shortName,
    code,
    emailDomain,
    logoUrl,
    address,
    website,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, university, "University onboarded"));
});

// PATCH /api/super-admin/universities/:id/status — activate/deactivate
const updateUniversityStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(400, "status must be active | inactive");
  }

  const university = await University.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  if (!university) throw new ApiError(404, "University not found");

  return res
    .status(200)
    .json(new ApiResponse(200, university, "University status updated"));
});

// POST /api/super-admin/assign-university-admin — assign universityAdmin role
// If the email doesn't belong to an existing user, a new account is created
// and immediately marked emailVerified (superAdmin is vouching for this
// person directly, so no email verification link is needed). The new
// account gets a random password — the admin should use "Forgot Password"
// to set their own on first login.
const assignUniversityAdmin = asyncHandler(async (req, res) => {
  const { email, university: universityId, name } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !universityId) {
    throw new ApiError(400, "email and university are required");
  }

  const university = await University.findById(universityId);
  if (!university) throw new ApiError(404, "University not found");

  let user = await User.findOne({ email: normalizedEmail });
  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    const tempPassword = crypto.randomBytes(9).toString("base64url"); // random temp password
    user = await User.create({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: tempPassword,
      role: "universityAdmin",
      university: universityId,
      emailVerified: true, // admin assigned directly by superAdmin — no email link needed
      status: "active",
    });
  } else {
    user.role = "universityAdmin";
    user.university = universityId;
    user.emailVerified = true;
    await user.save();
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        isNewUser,
      },
      isNewUser
        ? `New account created and assigned as University Admin for ${university.name}. Ask them to use "Forgot Password" to set their own password.`
        : `${user.name} assigned as University Admin for ${university.name}`,
    ),
  );
});

// GET /api/super-admin/users — all users platform-wide
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter)
    .select("-password -refreshToken")
    .populate("university", "name code")
    .populate("hall", "name code")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.status(200).json(new ApiResponse(200, users, "All users fetched"));
});

module.exports = {
  // hallAdmin
  hallAdminDashboard,
  getHallStudents,
  updateStudentStatus,
  getHallRooms,
  updateDiningPlan,
  getTokenUsageReport,
  // universityAdmin
  universityAdminDashboard,
  getUniversityHalls,
  createHallByUniversityAdmin,
  assignHallAdmin,
  getCrossHallReport,
  // superAdmin
  superAdminDashboard,
  getUniversityDetail,
  getHallDetail,
  getAllUniversitiesAdmin,
  onboardUniversity,
  updateUniversityStatus,
  assignUniversityAdmin,
  getAllUsers,
};