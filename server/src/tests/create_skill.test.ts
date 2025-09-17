import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { createSkill } from '../handlers/create_skill';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInput: CreateSkillInput = {
  name: 'TypeScript',
  category: 'Programming Languages',
  level: 85,
  icon: 'typescript-icon.svg',
  experience: 3
};

// Test input with minimal required fields
const minimalInput: CreateSkillInput = {
  name: 'JavaScript',
  category: 'Programming Languages', 
  level: 90,
  icon: null,
  experience: null
};

describe('createSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a skill with all fields', async () => {
    const result = await createSkill(testInput);

    // Basic field validation
    expect(result.name).toEqual('TypeScript');
    expect(result.category).toEqual('Programming Languages');
    expect(result.level).toEqual(85);
    expect(result.icon).toEqual('typescript-icon.svg');
    expect(result.experience).toEqual(3);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
  });

  it('should create a skill with minimal fields', async () => {
    const result = await createSkill(minimalInput);

    // Basic field validation
    expect(result.name).toEqual('JavaScript');
    expect(result.category).toEqual('Programming Languages');
    expect(result.level).toEqual(90);
    expect(result.icon).toBeNull();
    expect(result.experience).toBeNull();
    expect(result.id).toBeDefined();
  });

  it('should save skill to database', async () => {
    const result = await createSkill(testInput);

    // Query using proper drizzle syntax
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, result.id))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('TypeScript');
    expect(skills[0].category).toEqual('Programming Languages');
    expect(skills[0].level).toEqual(85);
    expect(skills[0].icon).toEqual('typescript-icon.svg');
    expect(skills[0].experience).toEqual(3);
  });

  it('should create multiple skills with unique IDs', async () => {
    const skill1 = await createSkill(testInput);
    const skill2 = await createSkill(minimalInput);

    expect(skill1.id).not.toEqual(skill2.id);
    expect(skill1.name).not.toEqual(skill2.name);

    // Verify both exist in database
    const allSkills = await db.select()
      .from(skillsTable)
      .execute();

    expect(allSkills).toHaveLength(2);
    
    const skill1FromDb = allSkills.find(s => s.id === skill1.id);
    const skill2FromDb = allSkills.find(s => s.id === skill2.id);
    
    expect(skill1FromDb).toBeDefined();
    expect(skill2FromDb).toBeDefined();
    expect(skill1FromDb?.name).toEqual('TypeScript');
    expect(skill2FromDb?.name).toEqual('JavaScript');
  });

  it('should handle level boundaries correctly', async () => {
    // Test minimum level
    const minLevelSkill = await createSkill({
      ...testInput,
      name: 'Beginner Skill',
      level: 1
    });
    expect(minLevelSkill.level).toEqual(1);

    // Test maximum level
    const maxLevelSkill = await createSkill({
      ...testInput,
      name: 'Expert Skill',
      level: 100
    });
    expect(maxLevelSkill.level).toEqual(100);

    // Verify both skills are saved
    const skillsInDb = await db.select()
      .from(skillsTable)
      .execute();
    
    expect(skillsInDb).toHaveLength(2);
    
    const beginnerSkill = skillsInDb.find(s => s.level === 1);
    const expertSkill = skillsInDb.find(s => s.level === 100);
    
    expect(beginnerSkill).toBeDefined();
    expect(expertSkill).toBeDefined();
  });

  it('should handle experience field variations', async () => {
    // Test with zero experience
    const zeroExpSkill = await createSkill({
      ...testInput,
      name: 'New Skill',
      experience: 0
    });
    expect(zeroExpSkill.experience).toEqual(0);

    // Test with high experience
    const highExpSkill = await createSkill({
      ...testInput,
      name: 'Veteran Skill',
      experience: 15
    });
    expect(highExpSkill.experience).toEqual(15);

    // Verify database persistence
    const skills = await db.select()
      .from(skillsTable)
      .execute();

    expect(skills).toHaveLength(2);
    
    const zeroExpFromDb = skills.find(s => s.experience === 0);
    const highExpFromDb = skills.find(s => s.experience === 15);
    
    expect(zeroExpFromDb?.name).toEqual('New Skill');
    expect(highExpFromDb?.name).toEqual('Veteran Skill');
  });
});