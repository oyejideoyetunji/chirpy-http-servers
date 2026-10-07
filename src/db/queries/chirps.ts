import { and, eq } from "drizzle-orm";
import { chirps, users, type CreateChirpsParams } from "../schema";
import { db } from "../setup";

export async function createChirps(payload: CreateChirpsParams[]) {
    const result = db
        .insert(chirps)
        .values(payload)
        .returning();

    return result;
}

export async function getChirps() {
    const result = await db
        .select({ 
            id: chirps.id, createdAt: chirps.createdAt, updatedAt: chirps.updatedAt, body: chirps.body, user: users.email
        })
        .from(chirps)
        .innerJoin(users, eq(users.id, chirps.userId));

    return result;
}

export async function getChirp(id: string) {
    const [ result ] = await db
        .select({ 
            id: chirps.id, createdAt: chirps.createdAt, updatedAt: chirps.updatedAt, body: chirps.body, user: users.email
        })
        .from(chirps)
        .innerJoin(users, eq(users.id, chirps.userId))
        .where(eq(chirps.id, id));

    return result;
}

export async function deleteChirps(id: string, userId: string) {
    const [result] = await db
        .delete(chirps)
        .where(and(eq(chirps.id, id), eq(chirps.userId, userId)))
        .returning();

    return result;
}
