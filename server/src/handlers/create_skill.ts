import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput, type Skill } from '../schema';
import { randomUUID } from 'crypto';

export const createSkill = async (input: CreateSkillInput): Promise<Skill> => {
  try {
    // Generate unique ID for the skill
    const skillId = randomUUID();

    // Insert skill record
    const result = await db.insert(skillsTable)
      .values({
        id: skillId,
        name: input.name,
        category: input.category,
        level: input.level,
        icon: input.icon,
        experience: input.experience
      })
      .returning()
      .execute();

    // Return the created skill
    return result[0];
  } catch (error) {
    console.error('Skill creation failed:', error);
    throw error;
  }
};