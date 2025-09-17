import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type CreateTestimonialInput, type Testimonial } from '../schema';
import { randomUUID } from 'crypto';

export const createTestimonial = async (input: CreateTestimonialInput): Promise<Testimonial> => {
  try {
    // Insert testimonial record
    const result = await db.insert(testimonialsTable)
      .values({
        id: randomUUID(),
        client_name: input.client_name,
        client_photo: input.client_photo,
        client_position: input.client_position,
        client_company: input.client_company,
        testimonial: input.testimonial,
        rating: input.rating,
        linkedin_url: input.linkedin_url
      })
      .returning()
      .execute();

    const testimonial = result[0];
    return testimonial;
  } catch (error) {
    console.error('Testimonial creation failed:', error);
    throw error;
  }
};