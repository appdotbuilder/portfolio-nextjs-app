import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { desc } from 'drizzle-orm';
import { type Testimonial } from '../schema';

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    // Query testimonials ordered by creation date (newest first) for carousel display
    const results = await db.select()
      .from(testimonialsTable)
      .orderBy(desc(testimonialsTable.created_at))
      .execute();

    // Return testimonials with proper date conversion
    return results.map(testimonial => ({
      ...testimonial,
      created_at: testimonial.created_at
    }));
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    throw error;
  }
}