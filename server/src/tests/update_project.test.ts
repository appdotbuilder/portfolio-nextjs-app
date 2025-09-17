import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type CreateProjectInput } from '../schema';
import { updateProject } from '../handlers/update_project';
import { eq } from 'drizzle-orm';

// Helper function to create a test project
const createTestProject = async (id: string = 'test-project-1'): Promise<string> => {
  const testProjectData = {
    id,
    title: 'Original Test Project',
    description: 'Original project description',
    thumbnail: 'https://example.com/original-thumbnail.jpg',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    tech_stack: ['React', 'TypeScript'],
    live_url: 'https://example.com/live',
    github_url: 'https://github.com/test/project',
    featured: false
  };

  await db.insert(projectsTable).values(testProjectData).execute();
  return id;
};

describe('updateProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update project title', async () => {
    const projectId = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'Updated Project Title'
    };

    const result = await updateProject(updateInput);

    expect(result.id).toEqual(projectId);
    expect(result.title).toEqual('Updated Project Title');
    expect(result.description).toEqual('Original project description'); // Should remain unchanged
    expect(result.featured).toEqual(false); // Should remain unchanged
  });

  it('should update multiple fields at once', async () => {
    const projectId = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'New Amazing Project',
      description: 'This is an updated description with more details',
      featured: true,
      tech_stack: ['Vue.js', 'Node.js', 'PostgreSQL']
    };

    const result = await updateProject(updateInput);

    expect(result.title).toEqual('New Amazing Project');
    expect(result.description).toEqual('This is an updated description with more details');
    expect(result.featured).toEqual(true);
    expect(result.tech_stack).toEqual(['Vue.js', 'Node.js', 'PostgreSQL']);
    expect(result.thumbnail).toEqual('https://example.com/original-thumbnail.jpg'); // Should remain unchanged
  });

  it('should update nullable fields to null', async () => {
    const projectId = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      live_url: null,
      github_url: null
    };

    const result = await updateProject(updateInput);

    expect(result.live_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.title).toEqual('Original Test Project'); // Should remain unchanged
  });

  it('should update project to featured status', async () => {
    const projectId = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      featured: true
    };

    const result = await updateProject(updateInput);

    expect(result.featured).toEqual(true);
    expect(result.title).toEqual('Original Test Project'); // Other fields unchanged
  });

  it('should update images array', async () => {
    const projectId = await createTestProject();
    
    const newImages = [
      'https://example.com/new-image1.jpg',
      'https://example.com/new-image2.jpg',
      'https://example.com/new-image3.jpg'
    ];
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      images: newImages
    };

    const result = await updateProject(updateInput);

    expect(result.images).toEqual(newImages);
    expect(result.images).toHaveLength(3);
  });

  it('should persist changes in database', async () => {
    const projectId = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'Database Persisted Title',
      description: 'Database persisted description'
    };

    await updateProject(updateInput);

    // Query database directly to verify persistence
    const dbProjects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    expect(dbProjects).toHaveLength(1);
    expect(dbProjects[0].title).toEqual('Database Persisted Title');
    expect(dbProjects[0].description).toEqual('Database persisted description');
  });

  it('should throw error for non-existent project', async () => {
    const updateInput: UpdateProjectInput = {
      id: 'non-existent-project',
      title: 'This should fail'
    };

    expect(updateProject(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update thumbnail URL', async () => {
    const projectId = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      thumbnail: 'https://example.com/new-awesome-thumbnail.jpg'
    };

    const result = await updateProject(updateInput);

    expect(result.thumbnail).toEqual('https://example.com/new-awesome-thumbnail.jpg');
  });

  it('should handle partial tech_stack update', async () => {
    const projectId = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: projectId,
      tech_stack: ['Python', 'Django', 'Redis', 'Docker']
    };

    const result = await updateProject(updateInput);

    expect(result.tech_stack).toEqual(['Python', 'Django', 'Redis', 'Docker']);
    expect(result.tech_stack).toHaveLength(4);
    expect(result.title).toEqual('Original Test Project'); // Other fields unchanged
  });
});