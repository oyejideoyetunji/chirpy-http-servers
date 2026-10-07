import { Router, type Request, type Response } from "express";
import { createUsers, getUserByEmail, updateUser } from "../../db";
import { BadRequest, NotFound, Unauthorized } from "../../shared/error";
import { hashPassword } from "../shared/helpers";
import { verifyAuthToken } from "../../middlewares";

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

userRouter.put("", verifyAuthToken, async (req, res) => {
    const body = req.body;

    if (!body) {
      res.status(400).send({ error: "body is required" });
    }
  
    if (!body.auth?.userId) {
      throw new Unauthorized();
    }

    if (typeof body.email !== "string") {
        throw new BadRequest("Bad request, email is required");
    }

    if (typeof body.password !== "string") {
        throw new BadRequest("Bad request, password is required");
    }

    const hashedPassword = await hashPassword(body.password);
    const updatedUser = await updateUser(body.auth?.userId, body.email, hashedPassword);

    if (!updatedUser) {
        throw new Error("Could not update user details");
    }

    res.send(updatedUser)
});
