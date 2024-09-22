import { NextFunction, Request, Response } from "express";
import SponsoredTransactionService from "../services/sponsoredTransaction.service";
import { SuccessResponse } from "../core/success.response";

class SponsoredTransactionController {
  static createSponsoredTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        transactionBytesBase64,
        sender,
        allowedAddresses,
        allowedMoveCallTargets,
        network,
      } = req.body;

      let result = await SponsoredTransactionService.createSponsorTransaction({
        transactionBytesBase64,
        sender,
        allowedAddresses,
        allowedMoveCallTargets,
        network,
      });

      return new SuccessResponse({
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
      return;
    }
  };
}

export default SponsoredTransactionController;
