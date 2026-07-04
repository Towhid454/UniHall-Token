const QRCode = require("qrcode");
const crypto = require("crypto");

const generateQRPayload = (studentId, hallId, date, mealType) => {
  const raw = `${studentId}-${hallId}-${date}-${mealType}-${Date.now()}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
};

const generateQRImage = async (payload) => {
  const qrImage = await QRCode.toDataURL(payload);
  return qrImage;
};

module.exports = { generateQRPayload, generateQRImage };
