import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type CreateExperienceInput, type Experience } from '../schema';
import { randomUUID } from 'crypto';

export const createExperience = async (input: CreateExperienceInput): Promise<Experience> => {
  try {
    // Generate unique ID for the experience record
    const id = randomUUID();

    // Insert experience record
    const result = await db.insert(experienceTable)
      .values({
        id,
        company: input.company,
        position: input.position,
        location: input.location,
        start_date: input.start_date,
        end_date: input.end_date,
        description: input.description, // JSON array stored directly
        current: input.current,
        company_logo: input.company_logo
      })
      .returning()
      .execute();

    // Return the created experience record
    const experience = result[0];
    return {
      ...experience,
      description: experience.description as string[] // Ensure proper type casting for JSON field
    };
  } catch (error) {
    console.error('Experience creation failed:', error);
    throw error;
  }
};