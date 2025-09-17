import { db } from '../db';
import { usersTable } from '../db/schema';
import { type User } from '../schema';

export async function getUser(): Promise<User | null> {
  try {
    // Since this is a portfolio site, there should typically be only one user record
    // We'll get the first user record (ordered by creation date)
    const results = await db.select()
      .from(usersTable)
      .orderBy(usersTable.created_at)
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    const user = results[0];
    return {
      ...user,
      social_links: user.social_links as Record<string, string> | null,
      created_at: user.created_at // timestamp is already a Date object
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}