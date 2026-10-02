import type { Request, Response, NextFunction } from "express";
import { parseRequestBody } from "../shared/helpers";

export async function parseJson(req: Request, res: Response, next: NextFunction) {
  if (req.headers["content-type"] !== "application/json") {
    return next();
  }

  const body = await parseRequestBody(req);

  req["body"] = body;
  next();
}
