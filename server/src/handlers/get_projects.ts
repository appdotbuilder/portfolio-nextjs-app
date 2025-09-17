import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type GetProjectsInput, type Project } from '../schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

export const getProjects = async (input?: GetProjectsInput): Promise<Project[]> => {
  try {
    // Build conditions array for filtering
    const conditions: SQL<unknown>[] = [];

    if (input?.featured !== undefined) {
      conditions.push(eq(projectsTable.featured, input.featured));
    }

    // Note: Category filtering is not fully implemented in this version
    // The schema doesn't have a direct category field
    // For now, we'll skip category filtering to focus on core functionality

    // Apply pagination and ordering
    const limit = input?.limit || 20;
    const offset = input?.offset || 0;
    
    // Build and execute query
    const baseQuery = db.select().from(projectsTable);
    
    const finalQuery = conditions.length > 0
      ? baseQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions))
      : baseQuery;
    
    const results = await finalQuery
      .orderBy(desc(projectsTable.created_at))
      .limit(limit)
      .offset(offset)
      .execute();

    // Increment view count for all returned projects
    if (results.length > 0) {
      const projectIds = results.map(project => project.id);
      for (const projectId of projectIds) {
        await db
          .update(projectsTable)
          .set({
            view_count: sql`${projectsTable.view_count} + 1`
          })
          .where(eq(projectsTable.id, projectId))
          .execute();
      }
    }

    // Convert the results to match the schema types
    return results.map(project => ({
      ...project,
      // Ensure arrays are properly typed
      images: project.images as string[],
      tech_stack: project.tech_stack as string[]
    }));
  } catch (error) {
    console.error('Get projects failed:', error);
    throw error;
  }
};