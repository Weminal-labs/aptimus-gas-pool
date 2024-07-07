import { Router } from "express";
import KeylessController from "../../controllers/keyless.controller";

const router = Router();

router.post("/zkp", KeylessController.getProof);

export default router;
