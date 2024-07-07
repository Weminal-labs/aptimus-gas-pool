import { Router } from "express";
import SponsoredTransactionController from "../../controllers/sponsoredTransaction.controller";

const router = Router();

router.post(
  "/sponsor",
  SponsoredTransactionController.createSponsoredTransaction
);

export default router;
