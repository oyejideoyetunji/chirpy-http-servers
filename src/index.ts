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
} from "./middlewares";
import { adminRouter } from "./routes/admin";
import { chirpRouter } from "./routes/chirps";
import { userRouter } from "./routes/users";

async function main() {
  const migrationClient = postgres(config.db.url, { max: 1 });
  await migrate(drizzle(migrationClient), config.db.migrationConfig);

  const app = express();
  const PORT = config.api.port;

  app.use(parseJson);
  app.use(nonOkRequestLogger);

  app.use("/app", updateServerHits, express.static("public"));
  app.use("/api/chirps", chirpRouter);
  app.use("/api/users", userRouter);
  app.use("/admin", adminRouter);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is now running at http://localhost:${PORT}`);
  });
}

main();
