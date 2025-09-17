import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type Experience } from '../schema';
import { desc } from 'drizzle-orm';

export async function getExperience(): Promise<Experience[]> {
  try {
    // Fetch all experience records, sorted by start date (most recent first)
    const results = await db.select()
      .from(experienceTable)
      .orderBy(desc(experienceTable.start_date))
      .execute();

    // Convert the results to match our schema type
    return results.map(record => ({
      id: record.id,
      company: record.company,
      position: record.position,
      location: record.location,
      start_date: record.start_date,
      end_date: record.end_date,
      description: record.description as string[], // JSONB field stored as array
      current: record.current,
      company_logo: record.company_logo
    }));
  } catch (error) {
    console.error('Failed to fetch experience records:', error);
    throw error;
  }
}