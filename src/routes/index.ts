import { Router } from "express";

import sponsoredTransactionRouter from "./sponsoredTransaction";
import keylessRouter from "./keyless";

const router = Router();

router.use("/v1/transaction-blocks", sponsoredTransactionRouter);
router.use("/v1/keyless", keylessRouter);
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
  });

export default router;
