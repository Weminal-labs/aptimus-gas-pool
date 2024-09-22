import compression from "compression";
import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import { ErrorResponse, NotFoundErrorResponse } from "./core/error.response";
import router from "./routes";
import dotenv from 'dotenv';

dotenv.config();

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
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: "error",
      statusCode: statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
);

export default app;
