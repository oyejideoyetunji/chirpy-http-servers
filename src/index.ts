import express from "express";
import { nonOkRequestLogger } from "./middlewares";
import { updateServerHits } from "./middlewares/update-server-hits";
import { apiConfig } from "./config";

const app = express();
const PORT = 8080

app.use(nonOkRequestLogger);
app.use("/app", updateServerHits, express.static("public"));

app.get("/metrics", (req, res) => {
    res.send(`Hits: ${apiConfig.fileserverHits}`);
})

app.get("/reset", (req, res) => {
    apiConfig.fileserverHits = 0;
    res.send("OK");
})

app.get("/healthz", (req, res) => {
    res
        .set({
            "Content-Type": "text/plain; charset=utf-8"
        })
        .send("OK");
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
