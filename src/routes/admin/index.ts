import { Router } from "express";
import { apiConfig } from "../../config";

const router = Router();

router.get("/metrics", (req, res) => {
  res
  .set({"Content-Type": "text/html; charset=utf-8"})
  .send(`
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${apiConfig.fileserverHits} times!</p>
      </body>
    </html>
  `);
});

router.post("/reset", (req, res) => {
  apiConfig.fileserverHits = 0;
  res.send("Hits reset to 0");
});

export const adminRouter: Router = router;
