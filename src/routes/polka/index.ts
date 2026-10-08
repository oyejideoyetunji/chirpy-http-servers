import { Router } from "express";
import { upgradeUser } from "../../db";
import { BadRequest, NotFound } from "../../shared/error";
import { verifyAPIKey } from "../../middlewares/verify-api-key";

export const polkaRouter: Router = Router();


polkaRouter.post(
    "/webhooks",
    verifyAPIKey,
    async (req, res) => {
        const body = req.body;
        const event = body["event"];
        const userId = body["data"]["userId"];

        if (!event || !userId) {
            throw new BadRequest();
        }

        if (event !== "user.upgraded") {
            res.status(204).send();
            return;
        }

        let user: any;

        try {
            user = await upgradeUser(userId, true);
        } catch (error) {
            console.log(error);
            throw new Error();
        }

        if (!user) {
            throw new NotFound();
        }
        res.status(204).send();
    }
);
