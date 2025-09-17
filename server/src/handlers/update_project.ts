import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type Project } from '../schema';
import { eq } from 'drizzle-orm';

export const updateProject = async (input: UpdateProjectInput): Promise<Project> => {
  try {
    // Build update object dynamically, only including provided fields
    const updateData: any = {};
    
    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    
    if (input.thumbnail !== undefined) {
      updateData.thumbnail = input.thumbnail;
    }
    
    if (input.images !== undefined) {
      updateData.images = input.images;
    }
    
    if (input.tech_stack !== undefined) {
      updateData.tech_stack = input.tech_stack;
    }
    
    if (input.live_url !== undefined) {
      updateData.live_url = input.live_url;
    }
    
    if (input.github_url !== undefined) {
      updateData.github_url = input.github_url;
    }
    
    if (input.featured !== undefined) {
      updateData.featured = input.featured;
    }

    // Update project record
    const result = await db.update(projectsTable)
      .set(updateData)
      .where(eq(projectsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Project with id ${input.id} not found`);
    }

    // Return the updated project with proper type casting for JSONB fields
    const project = result[0];
    return {
      ...project,
      images: project.images as string[],
      tech_stack: project.tech_stack as string[]
    };
  } catch (error) {
    console.error('Project update failed:', error);
    throw error;
  }
};