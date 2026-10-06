import { Router, type Request, type Response } from "express";
import { getUser } from "../../db";
import { BadRequest, Unauthorized } from "../../shared/types";
import { checkPasswordHash, makeJWT } from "../shared/helpers";
import { config } from "../../config";

export const loginRouter: Router = Router();

loginRouter.post("", async (req: Request, res: Response) => {
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

    const user = await getUser(payload.email);

    if (!user) {
        throw new Unauthorized("incorrect email or password");
    }

    const isValid = await checkPasswordHash(payload.password, user.hashedPassword);

    if (!isValid) {
        throw new Unauthorized("incorrect email or password");
    }

    const expiresIn = !!payload.expiresInSeconds && (Number(payload.expiresInSeconds) <= 60*60) ? payload.expiresInSeconds : 60*60*24

    const token = makeJWT({ userId: user.id, email: user.email }, expiresIn, config.api.jwtSecrete);

    const { hashedPassword, ...userData } = user

    res.status(200).send({ ...userData, token });
});
