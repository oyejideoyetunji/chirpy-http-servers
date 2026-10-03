import { Router, type Request, type Response } from "express";
import { BadRequest, NotFound } from "../../shared/types";
import { createUsers, getUserByEmail } from "../../db";

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

userRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
        throw new BadRequest();
    }

    const user = await getUserByEmail(id);

    if (!user) {
        throw new NotFound("user not found");
    }

    res.send(user);
});

