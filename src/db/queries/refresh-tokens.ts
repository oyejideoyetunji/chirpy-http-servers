import { eq } from "drizzle-orm";
import { refresh_tokens } from "../schema";
import { db } from "../setup";

export async function createRefreshToken(userId: string, token: string) {
    const [ result ] = await db.insert(refresh_tokens).values({
        userId,
        token,
        expiresAt: new Date(Date.now() + (1000 * 60 * 60 * 24 * 60))
    }).returning();

    return result;
}

export async function getRefreshTokenRecord(token: string) {
    const [ result ] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));

    return result;
}

export async function revokeRefreshToken(token: string) {
    const [ result ] = await db.update(refresh_tokens).set({ revokedAt: new Date() }).where(eq(refresh_tokens.token, token)).returning();

    return result;
}
