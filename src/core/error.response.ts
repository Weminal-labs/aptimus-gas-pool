import { ReasonPhrases, StatusCodes } from "http-status-codes";

class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundErrorResponse extends ErrorResponse {
  constructor(message: string = ReasonPhrases.NOT_FOUND) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

class AuthorizationErrorResponse extends ErrorResponse {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export { ErrorResponse, NotFoundErrorResponse, AuthorizationErrorResponse };
