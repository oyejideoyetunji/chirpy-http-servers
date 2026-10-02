import { Router } from "express";
import { BadRequest } from "../../shared/types";

const router = Router();

router.get("/healthz", (req, res) => {
  res
    .set({"Content-Type": "text/plain; charset=utf-8"})
    .send("OK");
});

router.post("/validate_chirp", (req, res) => {
  const body = req.body;

  if (!body) {
    res.status(400).send({ error: "body is required" });
  }

  if (!body.body || typeof body.body !== "string") {
    res.status(400).send({ error: "Invalid Body was sent" });
  }

  if (body.body.length > 140) {
    throw new BadRequest("Chirp is too long. Max length is 140");
  }

  const cleanedBody = body.body.replace(/kerfuffle|sharbert|fornax/ig, "****")

  res.send({ cleanedBody });
});

export const apiRouter: Router = router;
