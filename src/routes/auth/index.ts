import { Router, type Request, type Response } from "express";
import { randomBytes } from "node:crypto";
import { config } from "../../config";
import { createRefreshToken, getRefreshTokenRecord, getUserById, getUserWithHashedPassword, revokeRefreshToken } from "../../db";
import { BadRequest, Unauthorized } from "../../shared/error";
import { checkPasswordHash, getBearerToken, makeJWT } from "../shared/helpers";

export const loginRouter: Router = Router().post("", async (req: Request, res: Response) => {
    const payload = req.body;

    if (!payload) {
        throw new BadRequest("Bad request, request body is empty");
    }

    if (typeof payload.email !== "string") {
        throw new BadRequest("Bad request, email is required");
    }

    if (typeof payload.password !== "string") {
        throw new BadRequest("Bad request, password is required");
    }

    const user = await getUserWithHashedPassword(payload.email);

    if (!user) {
        throw new Unauthorized("incorrect email or password");
    }

    const isValid = await checkPasswordHash(payload.password, user.hashedPassword);

    if (!isValid) {
        throw new Unauthorized("incorrect email or password");
    }

    const token = makeJWT({ userId: user.id, email: user.email }, 60*60, config.api.jwtSecrete);

    const refreshToken = makeRandomBase64String();

    const refreshTokenRecord = await createRefreshToken(user.id, refreshToken)

    if (!refreshTokenRecord) {
        throw new Error("Failed to create refresh token");
    }

    const { hashedPassword, ...userData } = user;

    res.status(200).send({ ...userData, token, refreshToken: refreshTokenRecord?.token });
});

export const refreshRouter: Router = Router().post("", async (req: Request, res: Response) => {
    const refreshToken = getBearerToken(req);

    const refreshTokenRecord = await getRefreshTokenRecord(refreshToken);

    if (!refreshTokenRecord) {
        throw new Unauthorized();
    }

    if (refreshTokenRecord.revokedAt || new Date(refreshTokenRecord.expiresAt).getTime() < Date.now()) {
        throw new Unauthorized();
    }
    

    const user = await getUserById(refreshTokenRecord.userId);

    if (!user) {
        throw new Unauthorized();
    }

    const token = makeJWT({ userId: user.id, email: user.email }, 60*60, config.api.jwtSecrete);

    res.send({ token });
});

export const revokeRouter: Router = Router().post("", async (req, res) => {
    const token = getBearerToken(req);

    const revokedRecord = await revokeRefreshToken(token);

    if (!revokedRecord) {
        throw new Unauthorized();
    }

    res.status(204).send({})
})

function makeRandomBase64String() {
    return randomBytes(64).toString("hex");
}

