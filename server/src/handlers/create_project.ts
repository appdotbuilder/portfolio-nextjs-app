import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type Project } from '../schema';
import { randomUUID } from 'crypto';

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  try {
    // Generate unique ID for the project
    const projectId = randomUUID();

    // Insert project record
    const result = await db.insert(projectsTable)
      .values({
        id: projectId,
        title: input.title,
        description: input.description,
        thumbnail: input.thumbnail,
        images: input.images, // JSON field - stored as-is
        tech_stack: input.tech_stack, // JSON field - stored as-is
        live_url: input.live_url,
        github_url: input.github_url,
        featured: input.featured || false // Use input value or default
      })
      .returning()
      .execute();

    const project = result[0];
    return {
      ...project,
      // Ensure proper types for returned data
      images: project.images as string[],
      tech_stack: project.tech_stack as string[]
    };
  } catch (error) {
    console.error('Project creation failed:', error);
    throw error;
  }
};