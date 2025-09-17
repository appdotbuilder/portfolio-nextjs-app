import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type CreateTestimonialInput } from '../schema';
import { createTestimonial } from '../handlers/create_testimonial';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateTestimonialInput = {
  client_name: 'John Doe',
  client_photo: 'https://example.com/photo.jpg',
  client_position: 'Senior Developer',
  client_company: 'Tech Corp',
  testimonial: 'Excellent work! The portfolio website exceeded all expectations and was delivered on time.',
  rating: 5,
  linkedin_url: 'https://linkedin.com/in/johndoe'
};

// Test input with minimal required fields
const minimalInput: CreateTestimonialInput = {
  client_name: 'Jane Smith',
  client_photo: null,
  client_position: 'Product Manager',
  client_company: 'StartupXYZ',
  testimonial: 'Great collaboration and professional delivery.',
  rating: 4,
  linkedin_url: null
};

describe('createTestimonial', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a testimonial with all fields', async () => {
    const result = await createTestimonial(testInput);

    // Basic field validation
    expect(result.client_name).toEqual('John Doe');
    expect(result.client_photo).toEqual('https://example.com/photo.jpg');
    expect(result.client_position).toEqual('Senior Developer');
    expect(result.client_company).toEqual('Tech Corp');
    expect(result.testimonial).toEqual('Excellent work! The portfolio website exceeded all expectations and was delivered on time.');
    expect(result.rating).toEqual(5);
    expect(result.linkedin_url).toEqual('https://linkedin.com/in/johndoe');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a testimonial with minimal fields', async () => {
    const result = await createTestimonial(minimalInput);

    // Basic field validation
    expect(result.client_name).toEqual('Jane Smith');
    expect(result.client_photo).toBeNull();
    expect(result.client_position).toEqual('Product Manager');
    expect(result.client_company).toEqual('StartupXYZ');
    expect(result.testimonial).toEqual('Great collaboration and professional delivery.');
    expect(result.rating).toEqual(4);
    expect(result.linkedin_url).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save testimonial to database', async () => {
    const result = await createTestimonial(testInput);

    // Query using proper drizzle syntax
    const testimonials = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, result.id))
      .execute();

    expect(testimonials).toHaveLength(1);
    const saved = testimonials[0];
    expect(saved.client_name).toEqual('John Doe');
    expect(saved.client_position).toEqual('Senior Developer');
    expect(saved.client_company).toEqual('Tech Corp');
    expect(saved.testimonial).toEqual(testInput.testimonial);
    expect(saved.rating).toEqual(5);
    expect(saved.linkedin_url).toEqual('https://linkedin.com/in/johndoe');
    expect(saved.created_at).toBeInstanceOf(Date);
  });

  it('should generate unique IDs for multiple testimonials', async () => {
    const result1 = await createTestimonial(testInput);
    const result2 = await createTestimonial(minimalInput);

    expect(result1.id).toBeDefined();
    expect(result2.id).toBeDefined();
    expect(result1.id).not.toEqual(result2.id);

    // Verify both are saved in database
    const allTestimonials = await db.select()
      .from(testimonialsTable)
      .execute();

    expect(allTestimonials).toHaveLength(2);
    const ids = allTestimonials.map(t => t.id);
    expect(ids).toContain(result1.id);
    expect(ids).toContain(result2.id);
  });

  it('should handle various rating values', async () => {
    // Test different rating values
    const ratings = [1, 2, 3, 4, 5];
    
    for (const rating of ratings) {
      const input = {
        ...testInput,
        client_name: `Client ${rating}`,
        rating
      };
      
      const result = await createTestimonial(input);
      expect(result.rating).toEqual(rating);
    }

    // Verify all testimonials saved
    const allTestimonials = await db.select()
      .from(testimonialsTable)
      .execute();

    expect(allTestimonials).toHaveLength(5);
    const savedRatings = allTestimonials.map(t => t.rating).sort();
    expect(savedRatings).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle long testimonial text', async () => {
    const longTestimonial = 'This is a very long testimonial that goes into great detail about the exceptional quality of work delivered. '.repeat(10);
    
    const input = {
      ...testInput,
      testimonial: longTestimonial
    };

    const result = await createTestimonial(input);
    expect(result.testimonial).toEqual(longTestimonial);

    // Verify it's properly saved in database
    const saved = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, result.id))
      .execute();

    expect(saved[0].testimonial).toEqual(longTestimonial);
  });
});