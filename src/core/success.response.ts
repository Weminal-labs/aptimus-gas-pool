import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Response } from "express";

interface SuccessResponseOptions {
  message?: string;
  statusCode?: number;
  reasonPhrase?: string;
  data: object;
}

class SuccessResponse {
  message: string;
  statusCode: number;
  data: object;

  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonPhrase = ReasonPhrases.OK,
    data = {},
  }: SuccessResponseOptions) {
    this.message = !message ? reasonPhrase : message;
    this.statusCode = statusCode;
    this.data = data;
  }

  send(res: Response, _headers: object = {}) {
    return res.status(this.statusCode).json(this);
  }
}

export { SuccessResponse };
