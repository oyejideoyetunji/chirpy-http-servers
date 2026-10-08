import type { NextFunction, Request, Response } from "express";
import { getAPIKey } from "../routes/shared/helpers";
import { config } from "../config";
import { Unauthorized } from "../shared/error";

export async function verifyAPIKey(req: Request, _: Response, next: NextFunction) {
    const apikey = getAPIKey(req);

    if (apikey !== config.api.polkaKey) {
        throw new Unauthorized();
    }

    req["body"] = {...req["body"], client: { apikey }}

    next();
}
