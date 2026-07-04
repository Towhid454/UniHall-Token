const Room = require("../models/Room.model");
const RoomAllotment = require("../models/RoomAllotment.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─── STUDENT ROUTES ──────────────────────────────────────

// GET /api/rooms — get all available rooms in student's hall
const getRoomsInMyHall = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ hall: req.user.hall }).sort("roomNumber");
  return res.status(200).json(new ApiResponse(200, rooms, "Rooms fetched"));
});

// POST /api/rooms/allotments — student requests a room
const requestRoom = asyncHandler(async (req, res) => {
  const { roomId, requestType, reason } = req.body;

  if (!requestType) throw new ApiError(400, "requestType is required");
  if (!["new", "change", "cancel"].includes(requestType)) {
    throw new ApiError(400, "requestType must be new | change | cancel");
  }

  // Check for existing pending request
  const existingPending = await RoomAllotment.findOne({
    student: req.user._id,
    status: "pending",
  });
  if (existingPending) {
    throw new ApiError(409, "You already have a pending room request");
  }

  // Validate room belongs to student's hall
  if (roomId) {
    const room = await Room.findOne({ _id: roomId, hall: req.user.hall });
    if (!room) throw new ApiError(404, "Room not found in your hall");
    if (room.status === "full") throw new ApiError(400, "Room is already full");
  }

  const allotment = await RoomAllotment.create({
    student: req.user._id,
    hall: req.user.hall,
    room: roomId || null,
    requestType,
    reason,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, allotment, "Room request submitted"));
});

// GET /api/rooms/allotments/my — student's own allotment history
const getMyAllotments = asyncHandler(async (req, res) => {
  const allotments = await RoomAllotment.find({ student: req.user._id })
    .populate("room", "roomNumber floor capacity type")
    .populate("hall", "name code")
    .populate("reviewedBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, allotments, "Allotment history fetched"));
});

// ─── HALL ADMIN ROUTES ───────────────────────────────────

// GET /api/rooms/allotments — hallAdmin sees all requests for their hall
const getAllotmentRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { hall: req.user.hall };
  if (status) filter.status = status;

  const allotments = await RoomAllotment.find(filter)
    .populate("student", "name email studentId department")
    .populate("room", "roomNumber floor capacity type")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, allotments, "Allotment requests fetched"));
});

// PATCH /api/rooms/allotments/:id — hallAdmin approves or rejects
const reviewAllotment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, roomId, reviewNote } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "status must be approved | rejected");
  }

  const allotment = await RoomAllotment.findOne({
    _id: id,
    hall: req.user.hall, // scoped to hallAdmin's hall
  });
  if (!allotment) throw new ApiError(404, "Allotment request not found");
  if (allotment.status !== "pending") {
    throw new ApiError(400, "Only pending requests can be reviewed");
  }

  // If approving, assign room + update occupants
  if (status === "approved") {
    if (!roomId) throw new ApiError(400, "roomId is required when approving");

    const room = await Room.findOne({ _id: roomId, hall: req.user.hall });
    if (!room) throw new ApiError(404, "Room not found in your hall");
    if (room.occupants.length >= room.capacity) {
      throw new ApiError(400, "Room is already at full capacity");
    }

    // Add student to room occupants
    room.occupants.push(allotment.student);
    if (room.occupants.length >= room.capacity) room.status = "full";
    await room.save();

    allotment.room = roomId;
    allotment.startDate = new Date();
  }

  allotment.status = status;
  allotment.reviewedBy = req.user._id;
  allotment.reviewNote = reviewNote || "";
  await allotment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, allotment, `Request ${status}`));
});

// POST /api/rooms — hallAdmin creates a room
const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, floor, capacity, type } = req.body;

  if (!roomNumber || !capacity) {
    throw new ApiError(400, "roomNumber and capacity are required");
  }

  const existing = await Room.findOne({
    hall: req.user.hall,
    roomNumber,
  });
  if (existing)
    throw new ApiError(409, "Room number already exists in this hall");

  const room = await Room.create({
    hall: req.user.hall,
    roomNumber,
    floor,
    capacity,
    type,
  });

  return res.status(201).json(new ApiResponse(201, room, "Room created"));
});

module.exports = {
  getRoomsInMyHall,
  requestRoom,
  getMyAllotments,
  getAllotmentRequests,
  reviewAllotment,
  createRoom,
};
