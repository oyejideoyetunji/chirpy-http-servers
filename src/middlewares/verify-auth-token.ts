import { type Request, type Response, type NextFunction } from "express";
import { Unauthorized } from "../shared/types";
import { getBearerToken, validateJWT } from "../routes/shared/helpers";
import { getUserById } from "../db";
import { config } from "../config";

export async function verifyAuthToken(req: Request, _: Response, next: NextFunction) {
    const token = getBearerToken(req)

    const data = validateJWT(token, config.api.jwtSecrete);

    if (!data || typeof data == "string" || !data.userId || !data.email || !data.exp) {
        throw new Unauthorized();
    }

    const user = getUserById(data.userId);

    if (!user) {
        throw new Unauthorized();
    }

    req["body"] = {...req["body"], auth : { ...data }}

    next();
}
