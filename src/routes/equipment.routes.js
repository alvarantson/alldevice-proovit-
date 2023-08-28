import { Router } from "express";
import equipmentController from "../controllers/equipment.controller";
// import authMiddleware from "../middlewares/auth.middleware";

const equipmentRoutes = Router();
/**
 * @swagger
 * /:
 *   post:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
equipmentRoutes.post("/equipment", equipmentController.add);
equipmentRoutes.get("/equipment", equipmentController.query);
equipmentRoutes.get("/equipment/due", equipmentController.dueForMaintenance);
equipmentRoutes.get("/equipment/:id", equipmentController.get);
equipmentRoutes.put("/equipment/:id", equipmentController.update);
equipmentRoutes.delete("/equipment/:id", equipmentController.delete);

export { equipmentRoutes };
