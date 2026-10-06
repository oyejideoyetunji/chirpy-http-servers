import { Router, type Request, type Response } from "express";
import { BadRequest } from "../../shared/error";
import { createUsers } from "../../db";

export const userRouter: Router = Router();

userRouter.post("", async (req: Request, res: Response) => {
    const payload = req.body;

    if (!payload || typeof payload.email !== "string") {
        throw new BadRequest("Bad request, email is required");
    }

    const [ user ] = await createUsers([{ email: payload.email }]);

    if (!user) {
        throw new Error("Could not create user");
    }

    res.status(201).send(user);
});
