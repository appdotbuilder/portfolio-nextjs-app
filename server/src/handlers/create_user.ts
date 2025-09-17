import { db } from '../db';
import { usersTable } from '../db/schema';
import { type CreateUserInput, type User } from '../schema';
import { randomUUID } from 'crypto';

export const createUser = async (input: CreateUserInput): Promise<User> => {
  try {
    // Generate a unique ID for the user
    const userId = randomUUID();

    // Insert user record
    const result = await db.insert(usersTable)
      .values({
        id: userId,
        name: input.name,
        email: input.email,
        bio: input.bio,
        avatar: input.avatar,
        resume: input.resume,
        social_links: input.social_links
      })
      .returning()
      .execute();

    // Return the created user
    const user = result[0];
    return {
      ...user,
      social_links: user.social_links as Record<string, string> | null
    };
  } catch (error) {
    console.error('User creation failed:', error);
    throw error;
  }
};