import type { NextFunction, Request, Response } from "express";
import { apiConfig } from "../config";

export function updateServerHits(req: Request, res: Response, next: NextFunction) {
    apiConfig.fileserverHits++;
    next();
};
