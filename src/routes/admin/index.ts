import { Router } from "express";
import { config } from "../../config";
import { deleteUsers } from "../../db";
import { Forbidden } from "../../shared/types";

const router = Router();

router.get("/metrics", (req, res) => {
  res
  .set({"Content-Type": "text/html; charset=utf-8"})
  .send(`
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
      </body>
    </html>
  `);
});

router.post("/reset", async (req, res) => {
  const platform = config.api.platform;

  if (platform !== "dev") {
    throw new Forbidden();
  }

  config.api.fileserverHits = 0;

  await deleteUsers();

  res.send( { message: "Hits and users reset to 0" });
});

export const adminRouter: Router = router;
