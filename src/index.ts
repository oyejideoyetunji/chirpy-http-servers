import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { config } from "./config";
import {
  errorHandler,
  nonOkRequestLogger,
  parseJson,
  updateServerHits,
  verifyAuthToken,
} from "./middlewares";
import { adminRouter } from "./routes/admin";
import { chirpRouter } from "./routes/chirps";
import { loginRouter } from "./routes/login";
import { userRouter } from "./routes/users";

async function main() {
  try {
    const migrationClient = postgres(config.db.url, { max: 1 });
    await migrate(drizzle(migrationClient), config.db.migrationConfig);

    const app = express();
    const PORT = config.api.port;

    app.use(parseJson);
    app.use(nonOkRequestLogger);
    app.use("/admin", adminRouter);
    app.use("/api/users", userRouter);
    app.use("/api/login", loginRouter);
    app.use("/app", updateServerHits, express.static("public"));

    app.use(verifyAuthToken);

    app.use("/api/chirps", chirpRouter);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is now running at http://localhost:${PORT}`);
    });
  } catch {
    console.log("There was an error")
  }
}

main();
