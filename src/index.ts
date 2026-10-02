import express from "express";
import { errorHandler, nonOkRequestLogger, parseJson, updateServerHits } from "./middlewares";
import { adminRouter } from "./routes/admin";
import { apiRouter } from "./routes/api";

const app = express();
const PORT = 8080

app.use(parseJson)
app.use(nonOkRequestLogger);

app.use("/app", updateServerHits, express.static("public"));
app.use("/api", apiRouter);
app.use("/admin", adminRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is now running at http://localhost:${PORT}`);
});
