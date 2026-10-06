import { envOrThrow } from "./shared/helpers";
import type { MigrationConfig } from "drizzle-orm/migrator";

const url = envOrThrow("DB_URL");
const port = envOrThrow("PORT");
const platform = envOrThrow("PLATFORM");
const jwtSecrete = envOrThrow("JWT_SECRETE");

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

type APIConfig = {
    port: number;
    platform: string;
    jwtSecrete: string;
    fileserverHits: number;
};

type Config = {
    db: DBConfig;
    api: APIConfig;
};

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db",
};

const db: DBConfig = {
    url,
    migrationConfig,
};

const api: APIConfig = {
    port: Number(port),
    platform,
    jwtSecrete,
    fileserverHits: 0,
};

export const config: Config = {
    db,
    api
};

