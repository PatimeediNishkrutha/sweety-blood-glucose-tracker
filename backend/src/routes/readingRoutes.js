import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listReadings, createReading, updateReading, deleteReading } from "../controllers/readingController.js";

const router = Router();
router.use(requireAuth);
router.get("/", listReadings);
router.post("/", createReading);
router.put("/:id", updateReading);
router.delete("/:id", deleteReading);
export default router;
