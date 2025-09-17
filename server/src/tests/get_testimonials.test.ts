import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { getTestimonials } from '../handlers/get_testimonials';

// Test data for creating testimonials
const testTestimonial1 = {
  id: 'testimonial-1',
  client_name: 'John Smith',
  client_photo: 'https://example.com/photo1.jpg',
  client_position: 'CEO',
  client_company: 'TechCorp',
  testimonial: 'Excellent work on our project. Highly recommended!',
  rating: 5,
  linkedin_url: 'https://linkedin.com/in/johnsmith'
};

const testTestimonial2 = {
  id: 'testimonial-2',
  client_name: 'Jane Doe',
  client_photo: null,
  client_position: 'CTO',
  client_company: 'StartupXYZ',
  testimonial: 'Great developer with strong problem-solving skills.',
  rating: 4,
  linkedin_url: null
};

const testTestimonial3 = {
  id: 'testimonial-3',
  client_name: 'Mike Johnson',
  client_photo: 'https://example.com/photo3.jpg',
  client_position: 'Product Manager',
  client_company: 'InnovateCorp',
  testimonial: 'Delivered the project on time and exceeded expectations.',
  rating: 5,
  linkedin_url: 'https://linkedin.com/in/mikejohnson'
};

describe('getTestimonials', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no testimonials exist', async () => {
    const result = await getTestimonials();
    
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return all testimonials with correct structure', async () => {
    // Insert test testimonials
    await db.insert(testimonialsTable).values([
      testTestimonial1,
      testTestimonial2
    ]).execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(2);
    
    // Check first testimonial structure
    const firstTestimonial = result.find(t => t.id === 'testimonial-1');
    expect(firstTestimonial).toBeDefined();
    expect(firstTestimonial!.client_name).toEqual('John Smith');
    expect(firstTestimonial!.client_photo).toEqual('https://example.com/photo1.jpg');
    expect(firstTestimonial!.client_position).toEqual('CEO');
    expect(firstTestimonial!.client_company).toEqual('TechCorp');
    expect(firstTestimonial!.testimonial).toEqual('Excellent work on our project. Highly recommended!');
    expect(firstTestimonial!.rating).toEqual(5);
    expect(firstTestimonial!.linkedin_url).toEqual('https://linkedin.com/in/johnsmith');
    expect(firstTestimonial!.created_at).toBeInstanceOf(Date);
    expect(firstTestimonial!.id).toEqual('testimonial-1');

    // Check second testimonial with null values
    const secondTestimonial = result.find(t => t.id === 'testimonial-2');
    expect(secondTestimonial).toBeDefined();
    expect(secondTestimonial!.client_name).toEqual('Jane Doe');
    expect(secondTestimonial!.client_photo).toBeNull();
    expect(secondTestimonial!.client_position).toEqual('CTO');
    expect(secondTestimonial!.client_company).toEqual('StartupXYZ');
    expect(secondTestimonial!.testimonial).toEqual('Great developer with strong problem-solving skills.');
    expect(secondTestimonial!.rating).toEqual(4);
    expect(secondTestimonial!.linkedin_url).toBeNull();
    expect(secondTestimonial!.created_at).toBeInstanceOf(Date);
  });

  it('should return testimonials sorted by creation date (newest first)', async () => {
    // Insert testimonials with slight delay to ensure different timestamps
    await db.insert(testimonialsTable).values(testTestimonial1).execute();
    
    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(testimonialsTable).values(testTestimonial2).execute();
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(testimonialsTable).values(testTestimonial3).execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(3);
    
    // Check that results are ordered by creation date (newest first)
    expect(result[0].created_at >= result[1].created_at).toBe(true);
    expect(result[1].created_at >= result[2].created_at).toBe(true);
    
    // The most recently created should be first
    expect(result[0].id).toEqual('testimonial-3');
    expect(result[1].id).toEqual('testimonial-2');
    expect(result[2].id).toEqual('testimonial-1');
  });

  it('should handle testimonials with different ratings correctly', async () => {
    const ratingTestData = [
      { ...testTestimonial1, id: 'rating-1', rating: 1 },
      { ...testTestimonial2, id: 'rating-3', rating: 3 },
      { ...testTestimonial3, id: 'rating-5', rating: 5 }
    ];

    await db.insert(testimonialsTable).values(ratingTestData).execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(3);
    
    // Verify rating values are preserved correctly
    const ratings = result.map(t => t.rating).sort();
    expect(ratings).toEqual([1, 3, 5]);
    
    // Verify all ratings are integers
    result.forEach(testimonial => {
      expect(typeof testimonial.rating).toBe('number');
      expect(Number.isInteger(testimonial.rating)).toBe(true);
      expect(testimonial.rating >= 1 && testimonial.rating <= 5).toBe(true);
    });
  });

  it('should handle testimonials with very long text content', async () => {
    const longTestimonial = {
      ...testTestimonial1,
      id: 'long-testimonial',
      testimonial: 'A'.repeat(1000), // Very long testimonial text
      client_name: 'B'.repeat(100)   // Long client name
    };

    await db.insert(testimonialsTable).values(longTestimonial).execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(1);
    expect(result[0].testimonial).toEqual('A'.repeat(1000));
    expect(result[0].client_name).toEqual('B'.repeat(100));
    expect(result[0].testimonial.length).toEqual(1000);
    expect(result[0].client_name.length).toEqual(100);
  });
});