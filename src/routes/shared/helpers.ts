import * as argon2 from "argon2";
import Jwt from "jsonwebtoken";
import { type Request } from "express";
import { Unauthorized } from "../../shared/error";

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
    const {name, token} = extractAuthToken(req);

    if (name.toLowerCase() !== "bearer" || !token) {
        throw new Unauthorized();
    }

    return token;
}

export function getAPIKey(req: Pick<Request, "headers">) {
    const {token} = extractAuthToken(req);

    if (!token) {
        throw new Unauthorized();
    }

    return token;
}

function extractAuthToken(req: Pick<Request, "headers">) {
    if (typeof req.headers.authorization !== "string") {
        throw new Unauthorized();
    }

    const auth = req.headers.authorization.split(" ");

    if (auth.length !== 2 || !auth[0] || !auth[1]) {
        throw new Unauthorized();
    }

    return { name: auth[0], token: auth[1] };
}
