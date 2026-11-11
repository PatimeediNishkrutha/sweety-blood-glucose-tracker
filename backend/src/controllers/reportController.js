import prisma from "../config/prisma.js";
import { getReportRange, parseDateOnly, formatDateOnly } from "../utils/date.js";

export async function getReport(req, res, next) {
  try {
    const type = req.params.type;
    const selectedDate = req.query.date;
    if (!parseDateOnly(selectedDate)) {
      return res.status(400).json({ message: "Please provide a valid date using YYYY-MM-DD." });
    }
    const { start, end } = getReportRange(type, selectedDate);
    const readings = await prisma.reading.findMany({
      where: { userId: req.user.id, date: { gte: start, lt: end } },
      orderBy: [{ date: "asc" }, { timeSlot: "asc" }]
    });

    const values = readings.map((reading) => reading.value);
    const count = values.length;
    const summary = count ? {
      highest: Math.max(...values),
      lowest: Math.min(...values),
      average: Math.round((values.reduce((sum, value) => sum + value, 0) / count) * 10) / 10,
      count
    } : { highest: null, lowest: null, average: null, count: 0 };

    return res.json({
      type,
      range: { start: formatDateOnly(start), end: formatDateOnly(new Date(end.getTime() - 86400000)) },
      summary,
      readings: type === "daily" ? readings : undefined
    });
  } catch (error) { return next(error); }
}
