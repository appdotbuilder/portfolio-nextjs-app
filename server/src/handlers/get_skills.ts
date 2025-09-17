import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type GetSkillsInput, type Skill } from '../schema';
import { eq } from 'drizzle-orm';

export async function getSkills(input?: GetSkillsInput): Promise<Skill[]> {
  try {
    // Build base query
    const baseQuery = db.select().from(skillsTable);

    // Apply category filter if provided
    const query = input?.category
      ? baseQuery.where(eq(skillsTable.category, input.category))
      : baseQuery;

    const results = await query.execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw error;
  }
}