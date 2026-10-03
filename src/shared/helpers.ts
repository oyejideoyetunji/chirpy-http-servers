process.loadEnvFile();


import type { Request } from "express";

export function parseRequestBody(req: Request) {
    return new Promise<any>((resolve) => {
        let data = "";
    
        req.on("data", (chunk) => {
          data += chunk;
        });

        req.on("end", () => {
            try {
                resolve(JSON.parse(data));
            } catch (error) {
                resolve(null);
            }
        });

        req.on("error", () => {
            resolve(null);
        })
    });
}

export function envOrThrow(key: string) {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Failed to load env variable ${key}`);
    }

    return value;
}
