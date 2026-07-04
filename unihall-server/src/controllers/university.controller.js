const University = require("../models/University.model");
const Hall = require("../models/Hall.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/universities — public (used by signup dropdown)
const getAllUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find({ status: "active" }).select(
    "name shortName code emailDomain logoUrl",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, universities, "Universities fetched"));
});

// GET /api/universities/:id/halls — public (used by signup dropdown)
const getHallsByUniversity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const university = await University.findById(id);
  if (!university) throw new ApiError(404, "University not found");

  const halls = await Hall.find({ university: id, status: "active" }).select(
    "name code provostName",
  );
  return res.status(200).json(new ApiResponse(200, halls, "Halls fetched"));
});

// POST /api/universities — superAdmin only (protected, added in Step 5+)
const createUniversity = asyncHandler(async (req, res) => {
  const { name, shortName, code, emailDomain, logoUrl, address, website } =
    req.body;

  if (!name || !shortName || !code || !emailDomain) {
    throw new ApiError(400, "name, shortName, code, emailDomain are required");
  }

  const existing = await University.findOne({ code: code.toUpperCase() });
  if (existing)
    throw new ApiError(409, "University with this code already exists");

  const university = await University.create({
    name,
    shortName,
    code,
    emailDomain,
    logoUrl,
    address,
    website,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, university, "University created"));
});

// POST /api/universities/:id/halls — universityAdmin only (protected, added in Step 5+)
const createHall = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, totalRooms, provostName, address } = req.body;

  if (!name || !code) throw new ApiError(400, "name and code are required");

  const university = await University.findById(id);
  if (!university) throw new ApiError(404, "University not found");

  const hall = await Hall.create({
    university: id,
    name,
    code,
    totalRooms,
    provostName,
    address,
  });

  return res.status(201).json(new ApiResponse(201, hall, "Hall created"));
});

module.exports = {
  getAllUniversities,
  getHallsByUniversity,
  createUniversity,
  createHall,
};
