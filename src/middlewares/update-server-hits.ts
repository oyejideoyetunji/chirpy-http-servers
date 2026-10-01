import type { NextFunction, Request, Response } from "express";
import { apiConfig } from "../config";

export const updateServerHits = async (req: Request, res: Response, next: NextFunction) => {
    apiConfig.fileserverHits++;
    next();
};
