import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { experienceTable } from '../db/schema';
import { getExperience } from '../handlers/get_experience';

describe('getExperience', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no experience records exist', async () => {
    const results = await getExperience();
    expect(results).toEqual([]);
  });

  it('should fetch a single experience record', async () => {
    // Insert test experience record
    await db.insert(experienceTable)
      .values({
        id: 'exp1',
        company: 'Tech Corp',
        position: 'Senior Developer',
        location: 'San Francisco, CA',
        start_date: new Date('2023-01-15'),
        end_date: new Date('2023-12-31'),
        description: ['Led development of key features', 'Mentored junior developers'],
        current: false,
        company_logo: 'https://example.com/logo.png'
      })
      .execute();

    const results = await getExperience();

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('exp1');
    expect(results[0].company).toBe('Tech Corp');
    expect(results[0].position).toBe('Senior Developer');
    expect(results[0].location).toBe('San Francisco, CA');
    expect(results[0].start_date).toBeInstanceOf(Date);
    expect(results[0].end_date).toBeInstanceOf(Date);
    expect(results[0].description).toEqual(['Led development of key features', 'Mentored junior developers']);
    expect(results[0].current).toBe(false);
    expect(results[0].company_logo).toBe('https://example.com/logo.png');
  });

  it('should handle experience record with minimal fields', async () => {
    // Insert experience record with only required fields
    await db.insert(experienceTable)
      .values({
        id: 'exp2',
        company: 'Startup Inc',
        position: 'Full Stack Developer',
        location: null,
        start_date: new Date('2022-06-01'),
        end_date: null,
        description: ['Built web applications from scratch'],
        current: true,
        company_logo: null
      })
      .execute();

    const results = await getExperience();

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('exp2');
    expect(results[0].company).toBe('Startup Inc');
    expect(results[0].position).toBe('Full Stack Developer');
    expect(results[0].location).toBeNull();
    expect(results[0].start_date).toBeInstanceOf(Date);
    expect(results[0].end_date).toBeNull();
    expect(results[0].description).toEqual(['Built web applications from scratch']);
    expect(results[0].current).toBe(true);
    expect(results[0].company_logo).toBeNull();
  });

  it('should return multiple experience records sorted by start date (most recent first)', async () => {
    // Insert multiple experience records with different start dates
    await db.insert(experienceTable)
      .values([
        {
          id: 'exp1',
          company: 'Old Company',
          position: 'Junior Developer',
          location: 'New York, NY',
          start_date: new Date('2020-01-15'),
          end_date: new Date('2022-05-31'),
          description: ['Learned the basics', 'Fixed bugs'],
          current: false,
          company_logo: null
        },
        {
          id: 'exp2',
          company: 'Current Company',
          position: 'Senior Developer',
          location: 'Remote',
          start_date: new Date('2023-06-01'),
          end_date: null,
          description: ['Leading projects', 'Architecting solutions'],
          current: true,
          company_logo: 'https://current.com/logo.png'
        },
        {
          id: 'exp3',
          company: 'Middle Company',
          position: 'Mid-Level Developer',
          location: 'Austin, TX',
          start_date: new Date('2022-06-01'),
          end_date: new Date('2023-05-31'),
          description: ['Developed features', 'Collaborated with team'],
          current: false,
          company_logo: 'https://middle.com/logo.png'
        }
      ])
      .execute();

    const results = await getExperience();

    expect(results).toHaveLength(3);
    
    // Verify sorting by start date (most recent first)
    expect(results[0].company).toBe('Current Company');
    expect(results[0].start_date).toEqual(new Date('2023-06-01'));
    
    expect(results[1].company).toBe('Middle Company');
    expect(results[1].start_date).toEqual(new Date('2022-06-01'));
    
    expect(results[2].company).toBe('Old Company');
    expect(results[2].start_date).toEqual(new Date('2020-01-15'));
  });

  it('should handle complex description arrays correctly', async () => {
    // Insert experience with multiple description bullet points
    await db.insert(experienceTable)
      .values({
        id: 'exp1',
        company: 'Complex Corp',
        position: 'Tech Lead',
        location: 'Seattle, WA',
        start_date: new Date('2023-01-01'),
        end_date: null,
        description: [
          'Led a team of 5 developers',
          'Designed and implemented microservices architecture',
          'Improved system performance by 40%',
          'Mentored junior developers and conducted code reviews',
          'Collaborated with product managers on feature requirements'
        ],
        current: true,
        company_logo: 'https://complex.com/logo.png'
      })
      .execute();

    const results = await getExperience();

    expect(results).toHaveLength(1);
    expect(results[0].description).toHaveLength(5);
    expect(results[0].description).toContain('Led a team of 5 developers');
    expect(results[0].description).toContain('Improved system performance by 40%');
    expect(results[0].description).toContain('Collaborated with product managers on feature requirements');
  });

  it('should verify data is fetched from database correctly', async () => {
    // Insert test record
    await db.insert(experienceTable)
      .values({
        id: 'test-exp',
        company: 'Database Test Corp',
        position: 'QA Engineer',
        location: 'Denver, CO',
        start_date: new Date('2023-03-15'),
        end_date: new Date('2023-09-30'),
        description: ['Automated testing', 'Quality assurance'],
        current: false,
        company_logo: 'https://dbtest.com/logo.png'
      })
      .execute();

    const results = await getExperience();

    // Verify the data matches what was inserted
    const record = results[0];
    expect(record.id).toBe('test-exp');
    expect(record.company).toBe('Database Test Corp');
    expect(record.position).toBe('QA Engineer');
    expect(record.location).toBe('Denver, CO');
    expect(record.current).toBe(false);
    expect(record.company_logo).toBe('https://dbtest.com/logo.png');
    
    // Verify dates are properly converted
    expect(record.start_date).toBeInstanceOf(Date);
    expect(record.end_date).toBeInstanceOf(Date);
    expect(record.start_date.getFullYear()).toBe(2023);
    expect(record.start_date.getMonth()).toBe(2); // March is month 2 (0-indexed)
    expect(record.start_date.getDate()).toBe(15);
  });
});