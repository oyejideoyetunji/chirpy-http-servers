import { Router, type Request, type Response } from "express";
import { createUsers, getUserByEmail } from "../../db";
import { BadRequest, NotFound } from "../../shared/error";
import { hashPassword } from "../shared/helpers";

export const userRouter: Router = Router();

userRouter.post("", async (req: Request, res: Response) => {
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

    const hashedPassword = await hashPassword(payload.password)

    const [ user ] = await createUsers([{ email: payload.email, hashedPassword }]);

    if (!user) {
        throw new Error("Could not create user");
    }

    res.status(201).send(user);
});

userRouter.get("/:email", async (req: Request, res: Response) => {
    const email = req.params.email;

    if (!email || typeof email !== "string") {
        throw new BadRequest();
    }

    const user = await getUserByEmail(email);

    if (!user) {
        throw new NotFound("user not found");
    }

    res.send(user);
});
