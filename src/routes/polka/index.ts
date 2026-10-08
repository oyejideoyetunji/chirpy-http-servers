import { Router } from "express";
import { upgradeUser } from "../../db";
import { BadRequest, NotFound } from "../../shared/error";

export const polkaRouter: Router = Router();


polkaRouter.post(
    "/webhooks", 
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

        try {
            const user = await upgradeUser(userId, true);

            if (!user) {
                throw new NotFound();
            }
    
            res.status(204).send();
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }
);
