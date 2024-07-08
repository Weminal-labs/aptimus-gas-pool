import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import KeylessService from "../services/keyless.service";
import { Headers } from "../types/headers";
import { AuthorizationErrorResponse } from "../core/error.response";

class KeylessController {
  static getProof = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const jwt = req.headers[Headers.KEYLESS_JWT]?.toString();
    if (!jwt) {
      throw new AuthorizationErrorResponse("JWT is required");
    }

    const { ephemeralKeyPairBase64, network } = req.body;

    let result = await KeylessService.getProof({
      jwt,
      ephemeralKeyPairBase64,
      network,
    });

    return new SuccessResponse({
      data: result,
    }).send(res);
  };
}

export default KeylessController;
