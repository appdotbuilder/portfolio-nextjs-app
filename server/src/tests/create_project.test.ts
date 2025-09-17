import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createProject } from '../handlers/create_project';
import { eq } from 'drizzle-orm';

// Comprehensive test input with all fields
const testInput: CreateProjectInput = {
  title: 'Portfolio Website',
  description: 'A modern portfolio website built with Next.js and TypeScript',
  thumbnail: 'https://example.com/thumbnail.jpg',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Drizzle ORM'],
  live_url: 'https://portfolio.example.com',
  github_url: 'https://github.com/user/portfolio',
  featured: true
};

// Minimal test input with required fields only
const minimalInput: CreateProjectInput = {
  title: 'Simple Project',
  description: 'A basic project description',
  thumbnail: 'https://example.com/simple.jpg',
  images: [],
  tech_stack: ['JavaScript'],
  live_url: null,
  github_url: null,
  featured: false
};

describe('createProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project with all fields', async () => {
    const result = await createProject(testInput);

    // Verify all fields are properly set
    expect(result.title).toEqual('Portfolio Website');
    expect(result.description).toEqual(testInput.description);
    expect(result.thumbnail).toEqual(testInput.thumbnail);
    expect(result.images).toEqual(['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);
    expect(result.tech_stack).toEqual(['Next.js', 'TypeScript', 'Tailwind CSS', 'Drizzle ORM']);
    expect(result.live_url).toEqual('https://portfolio.example.com');
    expect(result.github_url).toEqual('https://github.com/user/portfolio');
    expect(result.featured).toBe(true);
    expect(result.view_count).toEqual(0);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a project with minimal fields', async () => {
    const result = await createProject(minimalInput);

    // Verify required fields
    expect(result.title).toEqual('Simple Project');
    expect(result.description).toEqual('A basic project description');
    expect(result.thumbnail).toEqual('https://example.com/simple.jpg');
    expect(result.images).toEqual([]);
    expect(result.tech_stack).toEqual(['JavaScript']);
    expect(result.live_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.featured).toBe(false);
    expect(result.view_count).toEqual(0);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save project to database correctly', async () => {
    const result = await createProject(testInput);

    // Query database to verify persistence
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    const savedProject = projects[0];
    
    // Verify database fields
    expect(savedProject.title).toEqual('Portfolio Website');
    expect(savedProject.description).toEqual(testInput.description);
    expect(savedProject.thumbnail).toEqual(testInput.thumbnail);
    expect(savedProject.images).toEqual(['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);
    expect(savedProject.tech_stack).toEqual(['Next.js', 'TypeScript', 'Tailwind CSS', 'Drizzle ORM']);
    expect(savedProject.live_url).toEqual('https://portfolio.example.com');
    expect(savedProject.github_url).toEqual('https://github.com/user/portfolio');
    expect(savedProject.featured).toBe(true);
    expect(savedProject.view_count).toEqual(0);
    expect(savedProject.created_at).toBeInstanceOf(Date);
  });

  it('should handle JSON fields correctly', async () => {
    const complexInput: CreateProjectInput = {
      title: 'Complex Project',
      description: 'Testing JSON field handling',
      thumbnail: 'https://example.com/complex.jpg',
      images: [
        'https://example.com/screen1.jpg',
        'https://example.com/screen2.jpg',
        'https://example.com/screen3.jpg'
      ],
      tech_stack: [
        'React',
        'Node.js',
        'PostgreSQL',
        'Docker',
        'AWS',
        'TypeScript'
      ],
      live_url: 'https://complex.example.com',
      github_url: 'https://github.com/user/complex-project',
      featured: false
    };

    const result = await createProject(complexInput);

    // Verify array fields are properly handled
    expect(Array.isArray(result.images)).toBe(true);
    expect(result.images).toHaveLength(3);
    expect(result.images[0]).toEqual('https://example.com/screen1.jpg');

    expect(Array.isArray(result.tech_stack)).toBe(true);
    expect(result.tech_stack).toHaveLength(6);
    expect(result.tech_stack).toContain('React');
    expect(result.tech_stack).toContain('TypeScript');

    // Verify in database as well
    const dbProjects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    const dbProject = dbProjects[0];
    expect(dbProject.images).toEqual(complexInput.images);
    expect(dbProject.tech_stack).toEqual(complexInput.tech_stack);
  });

  it('should generate unique IDs for multiple projects', async () => {
    const input1: CreateProjectInput = {
      title: 'Project One',
      description: 'First project',
      thumbnail: 'https://example.com/thumb1.jpg',
      images: [],
      tech_stack: ['Vue.js'],
      live_url: null,
      github_url: null,
      featured: false
    };

    const input2: CreateProjectInput = {
      title: 'Project Two',
      description: 'Second project',
      thumbnail: 'https://example.com/thumb2.jpg',
      images: [],
      tech_stack: ['Angular'],
      live_url: null,
      github_url: null,
      featured: false
    };

    const result1 = await createProject(input1);
    const result2 = await createProject(input2);

    // Verify different IDs
    expect(result1.id).not.toEqual(result2.id);
    expect(typeof result1.id).toBe('string');
    expect(typeof result2.id).toBe('string');
    expect(result1.id.length).toBeGreaterThan(0);
    expect(result2.id.length).toBeGreaterThan(0);
  });

  it('should set default values correctly', async () => {
    const inputWithoutDefaults: CreateProjectInput = {
      title: 'Default Test Project',
      description: 'Testing default values',
      thumbnail: 'https://example.com/default.jpg',
      images: ['https://example.com/default-img.jpg'],
      tech_stack: ['HTML', 'CSS'],
      live_url: null,
      github_url: null,
      featured: false // Explicitly set to false
    };

    const result = await createProject(inputWithoutDefaults);

    // Verify defaults are applied
    expect(result.featured).toBe(false);
    expect(result.view_count).toEqual(0);
    expect(result.created_at).toBeInstanceOf(Date);
    
    // Verify timestamp is recent (within last 5 seconds)
    const now = new Date();
    const timeDiff = now.getTime() - result.created_at.getTime();
    expect(timeDiff).toBeLessThan(5000);
  });
});