import { eq } from "drizzle-orm";
import { users, type CreateUserParams } from "../schema";
import { db } from "../setup";

const userResponse = { id: users.id, createdAt: users.createdAt, updatedAt: users.updatedAt, email: users.email, isChirpyRed: users.isChirpyRed };

export async function createUsers(payload: CreateUserParams[]) {
    const result = await db
        .insert(users)
        .values(payload)
        .onConflictDoNothing()
        .returning(userResponse);
    
    return result;
}

export async function getUsers(limit: number) {
    const result = await db
        .select(userResponse)
        .from(users)
        .limit(limit);

    return result;
}

export async function getUserById(id: string) {
    const [ result ] = await db
        .select(userResponse)
        .from(users)
        .where(eq(users.id, id));

    return result;
}

export async function getUserByEmail(email: string) {
    const [ result ] = await db
        .select(userResponse)
        .from(users)
        .where(eq(users.email, email));

    return result;
}

export async function getUserWithHashedPassword(email: string) {
    const [ result ] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    return result;
}

export async function updateUser(userId: string, email: string, hashedPassword: string) {
    const [ result ] = await db
        .update(users)
        .set({ email, hashedPassword })
        .where(eq(users.id, userId))
        .returning(userResponse);

    return result;
}

export async function upgradeUser(userId: string, isChirpyRed: boolean) {
    const [ result ] = await db
        .update(users)
        .set({ isChirpyRed })
        .where(eq(users.id, userId))
        .returning(userResponse);

    return result;
}

export async function deleteUsers() {
    const result = await db
        .delete(users)
        .returning(userResponse);

    return result;
}
