import { Router } from "express";
import { BadRequest, NotFound, Unauthorized } from "../../shared/error";
import { createChirps, getChirp, getChirps, getUserById } from "../../db";

export const chirpRouter: Router = Router();

chirpRouter.get("/healthz", (req, res) => {
  res
    .set({"Content-Type": "text/plain; charset=utf-8"})
    .send("OK");
});

chirpRouter.get("", async (_, res) => {
  const chirps = await getChirps();
  res.send(chirps);
});

chirpRouter.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
      throw new BadRequest();
  }

  const chirp = await getChirp(id);

  if (!chirp) {
      throw new NotFound("chirp not found");
  }

  res.send(chirp);
});

chirpRouter.post("", async (req, res) => {
  const body = req.body;

  if (!body) {
    res.status(400).send({ error: "body is required" });
  }

  if (!body.auth?.userId) {
    throw new Unauthorized();
  }

  if (!body.body || typeof body.body !== "string") {
    res.status(400).send({ error: "Invalid Body was sent" });
  }

  if (body.body.length > 140) {
    throw new BadRequest("Chirp is too long. Max length is 140");
  }

  const user = getUserById(body.auth?.userId);

  if (!user) {
    throw new BadRequest("Invalid user");
  }

  const [ chirp ] = await createChirps([{
    userId: body.auth?.userId,
    body: body.body
  }]);

  res.status(201).send(chirp);
});
