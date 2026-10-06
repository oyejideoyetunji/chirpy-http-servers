import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, validateJWT } from ".//helpers";
import { config } from "../../config";
import type { JwtPayload } from "jsonwebtoken";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("Token Authentication", () => {
  const params = {
    userId: "b62ad2fe-ca84-4c86-8fb9-af34d5c2837e",
    email: "demouser@mail.com"
  };
  let token: string;
  

  beforeAll(async () => {
    token = makeJWT(params, 60*2, config.api.jwtSecrete);
  })

  it("should contain the correct params when decoded", () => {
    const data = validateJWT(token, config.api.jwtSecrete) as JwtPayload;

    expect(data.userId).toBe(params.userId);
    expect(data.email).toBe(params.email);
  })

});

describe("getBearerToken", () => {
  const token = "glshgkjvjvjvgvhkjhbvbjhvjbvcxfxgfcxgfhfhfsljfld";

  it("Returns the token in the Authorization header of the request", () => {
    expect(getBearerToken({ headers: { authorization : `Bearer ${token}`} })).toBe(token);
  })

  it("Throws an Unauthorized error when token is not applied", () => {
    expect(() => getBearerToken({ headers: { authorization : `Bearer `} })).toThrow("Unauthorized request");
  })
})
