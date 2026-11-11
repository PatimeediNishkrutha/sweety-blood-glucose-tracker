import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getReport } from "../controllers/reportController.js";

const router = Router();
router.use(requireAuth);
router.get("/:type", getReport);
export default router;
