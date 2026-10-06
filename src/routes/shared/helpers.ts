import * as argon2 from "argon2";
import Jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"
import { type Request } from "express";
import { Unauthorized } from "../../shared/types";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

type JWTParams = {
    userId: string;
    email: string;
}

export async function hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
}

export async function checkPasswordHash(password: string, hash: string) {
    const isMatch = await argon2.verify(hash, password);
    return isMatch;
}

export function makeJWT(params: JWTParams, expiresIn: number, secrete: string) {
    const token = Jwt.sign(params, secrete, { expiresIn });

    return token;
}

export function validateJWT(tokenString: string, secret: string) {
    const decoded = Jwt.verify(tokenString, secret);

    return decoded;
}

export function getBearerToken(req: Pick<Request, "headers">) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new Unauthorized();
    }

    return token;
}
