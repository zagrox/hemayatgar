import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      },
      "http_request",
    );
  });
  next();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorLogger(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error({ err, method: req.method, path: req.originalUrl }, "unhandled_error");
  res.status(500).json({ message: "خطای غیرمنتظره سرور رخ داد" });
}
