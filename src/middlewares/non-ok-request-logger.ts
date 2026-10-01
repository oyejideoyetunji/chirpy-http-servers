import type { Request, Response, NextFunction } from "express";


export function nonOkRequestLogger(req: Request, resp: Response, next: NextFunction) {
    resp.on("finish", (...args) => {
        if (resp.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${resp.statusCode}`);
        }
    });

    next();
}
