import prisma from "../config/prisma.js";
import { TIME_SLOTS, MIN_GLUCOSE, MAX_GLUCOSE } from "../constants.js";
import { parseDateOnly, todayUtcDate } from "../utils/date.js";

function validateReading(body) {
  const { date, timeSlot, value } = body;
  if (value === undefined || value === null || value === "") return "Please enter a glucose value.";
  if (!Number.isInteger(Number(value)) || Number(value) < MIN_GLUCOSE || Number(value) > MAX_GLUCOSE) {
    return "Value must be between 40 and 600 mg/dl.";
  }
  const parsedDate = parseDateOnly(date);
  if (!parsedDate) return "Please enter a valid date.";
  if (parsedDate > todayUtcDate()) return "Date cannot be in the future.";
  if (!TIME_SLOTS.includes(timeSlot)) return "Please select a valid time slot.";
  return null;
}

async function checkDailyLimit(userId, date, excludeId) {
  const count = await prisma.reading.count({
    where: { userId, date, ...(excludeId ? { id: { not: excludeId } } : {}) }
  });
  return count;
}

export async function listReadings(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit || "20", 10) || 20));
    const where = { userId: req.user.id };
    if (req.query.date) {
      const date = parseDateOnly(req.query.date);
      if (!date) return res.status(400).json({ message: "Date must use YYYY-MM-DD format." });
      where.date = date;
    }
    const [readings, total] = await Promise.all([
      prisma.reading.findMany({
        where, orderBy: [{ date: "desc" }, { timeSlot: "asc" }],
        skip: (page - 1) * limit, take: limit
      }),
      prisma.reading.count({ where })
    ]);
    return res.json({ readings, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

export async function createReading(req, res, next) {
  try {
    const message = validateReading(req.body);
    if (message) return res.status(400).json({ message });
    const date = parseDateOnly(req.body.date);
    const count = await checkDailyLimit(req.user.id, date);
    if (count >= 4) return res.status(400).json({ message: "You can add only 4 readings per day." });

    const duplicate = await prisma.reading.findFirst({
      where: { userId: req.user.id, date, timeSlot: req.body.timeSlot }
    });
    if (duplicate) {
      return res.status(409).json({ message: `You already have a ${req.body.timeSlot} reading for this date.` });
    }

    const reading = await prisma.reading.create({
      data: { userId: req.user.id, date, timeSlot: req.body.timeSlot, value: Number(req.body.value) }
    });
    return res.status(201).json({ message: "Reading saved successfully.", reading });
  } catch (error) { return next(error); }
}

export async function updateReading(req, res, next) {
  try {
    const message = validateReading(req.body);
    if (message) return res.status(400).json({ message });
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid reading ID." });

    const existing = await prisma.reading.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: "Reading not found." });

    const date = parseDateOnly(req.body.date);
    const count = await checkDailyLimit(req.user.id, date, id);
    if (count >= 4) return res.status(400).json({ message: "You can add only 4 readings per day." });

    const duplicate = await prisma.reading.findFirst({
      where: { userId: req.user.id, date, timeSlot: req.body.timeSlot, id: { not: id } }
    });
    if (duplicate) {
      return res.status(409).json({ message: `You already have a ${req.body.timeSlot} reading for this date.` });
    }

    const reading = await prisma.reading.update({
      where: { id },
      data: { date, timeSlot: req.body.timeSlot, value: Number(req.body.value) }
    });
    return res.json({ message: "Reading updated successfully.", reading });
  } catch (error) { return next(error); }
}

export async function deleteReading(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid reading ID." });
    const existing = await prisma.reading.findFirst({ where: { id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ message: "Reading not found." });
    await prisma.reading.delete({ where: { id } });
    return res.json({ message: "Reading deleted successfully." });
  } catch (error) { return next(error); }
}
