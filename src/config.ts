process.loadEnvFile();

import type { MigrationConfig } from "drizzle-orm/migrator";

function envOrThrow(key: string) {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Failed to load env variable ${key}`);
    }

    return value;
}

const url = envOrThrow("DB_URL");
const port = envOrThrow("PORT");
const platform = envOrThrow("PLATFORM");
const jwtSecrete = envOrThrow("JWT_SECRETE");
const polkaKey = envOrThrow("POLKA_KEY");

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

type APIConfig = {
    port: number;
    platform: string;
    polkaKey: string;
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
    polkaKey,
    jwtSecrete,
    fileserverHits: 0,
};

export const config: Config = {
    db,
    api
};

