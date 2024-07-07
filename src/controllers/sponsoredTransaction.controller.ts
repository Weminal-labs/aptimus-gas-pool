import { NextFunction, Request, Response } from "express";
import SponsoredTransactionService from "../services/sponsoredTransaction.service";
import { SuccessResponse } from "../core/success.response";

class SponsoredTransactionController {
  static createSponsoredTransaction = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const {
      transactionBytes,
      sender,
      allowedAddresses,
      allowedMoveCallTargets,
      network,
    } = req.body;

    let result = await SponsoredTransactionService.createSponsorTransaction({
      transactionBytes,
      sender,
      allowedAddresses,
      allowedMoveCallTargets,
      network,
    });

    return new SuccessResponse({
      data: result,
    }).send(res);
  };
}

export default SponsoredTransactionController;
