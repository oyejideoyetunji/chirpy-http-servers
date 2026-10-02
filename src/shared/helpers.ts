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
