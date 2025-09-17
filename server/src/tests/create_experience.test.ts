import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type CreateExperienceInput } from '../schema';
import { createExperience } from '../handlers/create_experience';
import { eq } from 'drizzle-orm';

// Complete test input with all fields
const testInput: CreateExperienceInput = {
  company: 'Tech Corp',
  position: 'Senior Software Engineer',
  location: 'San Francisco, CA',
  start_date: new Date('2022-01-01'),
  end_date: new Date('2023-12-31'),
  description: [
    'Led a team of 5 developers in building scalable web applications',
    'Implemented microservices architecture using Node.js and Docker',
    'Reduced application load time by 40% through performance optimization'
  ],
  current: false,
  company_logo: 'https://example.com/techcorp-logo.png'
};

// Test input for current position
const currentPositionInput: CreateExperienceInput = {
  company: 'Startup Inc',
  position: 'Full Stack Developer',
  location: 'Remote',
  start_date: new Date('2023-06-01'),
  end_date: null,
  description: [
    'Building modern web applications with React and TypeScript',
    'Collaborating with designers to create intuitive user interfaces'
  ],
  current: true,
  company_logo: null
};

// Minimal input test
const minimalInput: CreateExperienceInput = {
  company: 'Freelance',
  position: 'Web Developer',
  location: null,
  start_date: new Date('2021-01-01'),
  end_date: new Date('2021-06-30'),
  description: ['Developed custom websites for small businesses'],
  current: false,
  company_logo: null
};

describe('createExperience', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a complete experience record', async () => {
    const result = await createExperience(testInput);

    // Validate all fields
    expect(result.company).toEqual('Tech Corp');
    expect(result.position).toEqual('Senior Software Engineer');
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.start_date).toEqual(new Date('2022-01-01'));
    expect(result.end_date).toEqual(new Date('2023-12-31'));
    expect(result.description).toEqual([
      'Led a team of 5 developers in building scalable web applications',
      'Implemented microservices architecture using Node.js and Docker',
      'Reduced application load time by 40% through performance optimization'
    ]);
    expect(result.current).toEqual(false);
    expect(result.company_logo).toEqual('https://example.com/techcorp-logo.png');
    
    // Validate generated fields
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
  });

  it('should save experience to database correctly', async () => {
    const result = await createExperience(testInput);

    // Query the database to verify persistence
    const experiences = await db.select()
      .from(experienceTable)
      .where(eq(experienceTable.id, result.id))
      .execute();

    expect(experiences).toHaveLength(1);
    const saved = experiences[0];
    
    expect(saved.company).toEqual('Tech Corp');
    expect(saved.position).toEqual('Senior Software Engineer');
    expect(saved.location).toEqual('San Francisco, CA');
    expect(saved.start_date).toEqual(new Date('2022-01-01'));
    expect(saved.end_date).toEqual(new Date('2023-12-31'));
    expect(saved.description).toEqual([
      'Led a team of 5 developers in building scalable web applications',
      'Implemented microservices architecture using Node.js and Docker',
      'Reduced application load time by 40% through performance optimization'
    ]);
    expect(saved.current).toEqual(false);
    expect(saved.company_logo).toEqual('https://example.com/techcorp-logo.png');
  });

  it('should handle current position correctly', async () => {
    const result = await createExperience(currentPositionInput);

    expect(result.company).toEqual('Startup Inc');
    expect(result.position).toEqual('Full Stack Developer');
    expect(result.location).toEqual('Remote');
    expect(result.start_date).toEqual(new Date('2023-06-01'));
    expect(result.end_date).toBeNull();
    expect(result.current).toEqual(true);
    expect(result.company_logo).toBeNull();
    expect(result.description).toEqual([
      'Building modern web applications with React and TypeScript',
      'Collaborating with designers to create intuitive user interfaces'
    ]);
  });

  it('should handle minimal input with null values', async () => {
    const result = await createExperience(minimalInput);

    expect(result.company).toEqual('Freelance');
    expect(result.position).toEqual('Web Developer');
    expect(result.location).toBeNull();
    expect(result.start_date).toEqual(new Date('2021-01-01'));
    expect(result.end_date).toEqual(new Date('2021-06-30'));
    expect(result.description).toEqual(['Developed custom websites for small businesses']);
    expect(result.current).toEqual(false);
    expect(result.company_logo).toBeNull();
  });

  it('should handle complex description arrays', async () => {
    const complexDescriptions = [
      'Architected and implemented RESTful APIs serving 1M+ requests daily',
      'Led technical interviews and mentored junior developers',
      'Collaborated with product managers to define technical requirements',
      'Optimized database queries reducing response time by 60%',
      'Implemented comprehensive testing strategies including unit, integration, and E2E tests'
    ];

    const complexInput: CreateExperienceInput = {
      ...testInput,
      description: complexDescriptions
    };

    const result = await createExperience(complexInput);

    expect(result.description).toEqual(complexDescriptions);
    expect(Array.isArray(result.description)).toBe(true);
    expect(result.description.length).toEqual(5);
  });

  it('should create multiple experience records independently', async () => {
    const experience1 = await createExperience(testInput);
    const experience2 = await createExperience(currentPositionInput);

    // Verify both records exist and are different
    expect(experience1.id).not.toEqual(experience2.id);
    expect(experience1.company).not.toEqual(experience2.company);

    // Check database contains both records
    const allExperiences = await db.select()
      .from(experienceTable)
      .execute();

    expect(allExperiences).toHaveLength(2);
    
    const companies = allExperiences.map(exp => exp.company);
    expect(companies).toContain('Tech Corp');
    expect(companies).toContain('Startup Inc');
  });

  it('should handle date objects correctly', async () => {
    const specificDates: CreateExperienceInput = {
      company: 'Date Test Corp',
      position: 'Tester',
      location: 'Test City',
      start_date: new Date('2020-03-15'),
      end_date: new Date('2022-11-30'),
      description: ['Testing date handling'],
      current: false,
      company_logo: null
    };

    const result = await createExperience(specificDates);

    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.end_date).toBeInstanceOf(Date);
    expect(result.start_date.getFullYear()).toEqual(2020);
    expect(result.start_date.getMonth()).toEqual(2); // March is month 2 (0-indexed)
    expect(result.start_date.getDate()).toEqual(15);
    expect(result.end_date?.getFullYear()).toEqual(2022);
    expect(result.end_date?.getMonth()).toEqual(10); // November is month 10 (0-indexed)
    expect(result.end_date?.getDate()).toEqual(30);
  });
});