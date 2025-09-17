import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { getSkills } from '../handlers/get_skills';

// Test skills data
const testSkills = [
  {
    id: 'skill-1',
    name: 'JavaScript',
    category: 'Technical',
    level: 95,
    icon: 'javascript-icon.svg',
    experience: 5
  },
  {
    id: 'skill-2',
    name: 'TypeScript',
    category: 'Technical',
    level: 90,
    icon: 'typescript-icon.svg',
    experience: 3
  },
  {
    id: 'skill-3',
    name: 'Communication',
    category: 'Soft Skills',
    level: 85,
    icon: 'communication-icon.svg',
    experience: 8
  },
  {
    id: 'skill-4',
    name: 'Docker',
    category: 'Tools',
    level: 80,
    icon: 'docker-icon.svg',
    experience: 2
  },
  {
    id: 'skill-5',
    name: 'Spanish',
    category: 'Languages',
    level: 70,
    icon: null,
    experience: null
  }
];

describe('getSkills', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all skills when no filter is provided', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills();

    expect(result).toHaveLength(5);
    expect(result.map(s => s.name)).toContain('JavaScript');
    expect(result.map(s => s.name)).toContain('TypeScript');
    expect(result.map(s => s.name)).toContain('Communication');
    expect(result.map(s => s.name)).toContain('Docker');
    expect(result.map(s => s.name)).toContain('Spanish');
  });

  it('should return skills filtered by category', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills({ category: 'Technical' });

    expect(result).toHaveLength(2);
    expect(result.every(skill => skill.category === 'Technical')).toBe(true);
    expect(result.map(s => s.name)).toContain('JavaScript');
    expect(result.map(s => s.name)).toContain('TypeScript');
  });

  it('should return soft skills when filtered by Soft Skills category', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills({ category: 'Soft Skills' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Communication');
    expect(result[0].category).toBe('Soft Skills');
    expect(result[0].level).toBe(85);
    expect(result[0].experience).toBe(8);
  });

  it('should return tools when filtered by Tools category', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills({ category: 'Tools' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Docker');
    expect(result[0].category).toBe('Tools');
    expect(result[0].level).toBe(80);
    expect(result[0].experience).toBe(2);
  });

  it('should return languages when filtered by Languages category', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills({ category: 'Languages' });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Spanish');
    expect(result[0].category).toBe('Languages');
    expect(result[0].level).toBe(70);
    expect(result[0].icon).toBe(null);
    expect(result[0].experience).toBe(null);
  });

  it('should return empty array when no skills match the category filter', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills({ category: 'NonExistent' });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when no skills exist', async () => {
    const result = await getSkills();

    expect(result).toHaveLength(0);
  });

  it('should handle input with undefined category', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills({ category: undefined });

    expect(result).toHaveLength(5);
  });

  it('should preserve all skill fields in response', async () => {
    const singleSkill = testSkills[0];
    await db.insert(skillsTable).values([singleSkill]).execute();

    const result = await getSkills();

    expect(result).toHaveLength(1);
    const skill = result[0];
    expect(skill.id).toBe('skill-1');
    expect(skill.name).toBe('JavaScript');
    expect(skill.category).toBe('Technical');
    expect(skill.level).toBe(95);
    expect(skill.icon).toBe('javascript-icon.svg');
    expect(skill.experience).toBe(5);
  });
});