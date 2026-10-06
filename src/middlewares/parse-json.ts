import type { Request, Response, NextFunction } from "express";

export async function parseJson(req: Request, res: Response, next: NextFunction) {
  if (req.headers["content-type"] !== "application/json") {
    return next();
  }

  const body = await parseRequestBody(req);

  req["body"] = body;
  next();
}

function parseRequestBody(req: Request) {
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
