import compression from "compression";
import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import { ErrorResponse, NotFoundErrorResponse } from "./core/error.response";
import router from "./routes";

const app: Express = express();

// init middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db

// init routes
app.use("", router);

// handling errors
app.use((_req, _res, next) => {
  next(new NotFoundErrorResponse());
});

app.use(
  (error: ErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(error.statusCode).json({
      status: "error",
      statusCode: error.statusCode,
      message: error.message,
    });
  }
);

export default app;
