import { eq } from "drizzle-orm";
import { users, type CreateUserParams, type UserResponse } from "../schema";
import { db } from "../setup";

const userResponse = { id: users.id, createdAt: users.createdAt, updatedAt: users.updatedAt, email: users.email }

export async function createUsers(payload: CreateUserParams[]) {
    const result = await db
        .insert(users)
        .values(payload)
        .onConflictDoNothing()
        .returning(userResponse);
    
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

export async function getUser(email: string) {
    const [ result ] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    return result;
}

export async function deleteUsers() {
    const result = await db
        .delete(users)
        .returning();

    return result;
}
