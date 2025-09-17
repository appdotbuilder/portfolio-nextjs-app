import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  bio: z.string().nullable(),
  avatar: z.string().nullable(),
  resume: z.string().nullable(),
  social_links: z.record(z.string()).nullable(), // JSON field
  created_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Skill schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  level: z.number().int().min(1).max(100), // 1-100 proficiency level
  icon: z.string().nullable(),
  experience: z.number().int().nullable() // Years of experience
});

export type Skill = z.infer<typeof skillSchema>;

// Project schema
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()), // Array of image URLs
  tech_stack: z.array(z.string()), // Array of technologies
  live_url: z.string().url().nullable(),
  github_url: z.string().url().nullable(),
  featured: z.boolean(),
  view_count: z.number().int().default(0),
  created_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Certificate schema
export const certificateSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  issue_date: z.coerce.date(),
  credential_id: z.string().nullable(),
  verify_url: z.string().url().nullable(),
  image: z.string(),
  category: z.string().nullable()
});

export type Certificate = z.infer<typeof certificateSchema>;

// Experience schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  location: z.string().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable(),
  description: z.array(z.string()), // Array of bullet points
  current: z.boolean(),
  company_logo: z.string().nullable()
});

export type Experience = z.infer<typeof experienceSchema>;

// Testimonial schema
export const testimonialSchema = z.object({
  id: z.string(),
  client_name: z.string(),
  client_photo: z.string().nullable(),
  client_position: z.string(),
  client_company: z.string(),
  testimonial: z.string(),
  rating: z.number().int().min(1).max(5),
  linkedin_url: z.string().url().nullable(),
  created_at: z.coerce.date()
});

export type Testimonial = z.infer<typeof testimonialSchema>;

// Contact message schema
export const contactMessageSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  attachment: z.string().nullable(),
  status: z.enum(['new', 'read', 'replied']).default('new'),
  created_at: z.coerce.date()
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

// Newsletter subscription schema
export const newsletterSubscriptionSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  subscribed: z.boolean().default(true),
  created_at: z.coerce.date()
});

export type NewsletterSubscription = z.infer<typeof newsletterSubscriptionSchema>;

// Input schemas for creating/updating
export const createUserInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  bio: z.string().nullable(),
  avatar: z.string().nullable(),
  resume: z.string().nullable(),
  social_links: z.record(z.string()).nullable()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createSkillInputSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.number().int().min(1).max(100),
  icon: z.string().nullable(),
  experience: z.number().int().nullable()
});

export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;

export const createProjectInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
  tech_stack: z.array(z.string().min(1)),
  live_url: z.string().url().nullable(),
  github_url: z.string().url().nullable(),
  featured: z.boolean().default(false)
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const createCertificateInputSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issue_date: z.coerce.date(),
  credential_id: z.string().nullable(),
  verify_url: z.string().url().nullable(),
  image: z.string().url(),
  category: z.string().nullable()
});

export type CreateCertificateInput = z.infer<typeof createCertificateInputSchema>;

export const createExperienceInputSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable(),
  description: z.array(z.string().min(1)),
  current: z.boolean().default(false),
  company_logo: z.string().nullable()
});

export type CreateExperienceInput = z.infer<typeof createExperienceInputSchema>;

export const createTestimonialInputSchema = z.object({
  client_name: z.string().min(1),
  client_photo: z.string().nullable(),
  client_position: z.string().min(1),
  client_company: z.string().min(1),
  testimonial: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  linkedin_url: z.string().url().nullable()
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialInputSchema>;

export const createContactMessageInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  attachment: z.string().nullable()
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageInputSchema>;

export const createNewsletterSubscriptionInputSchema = z.object({
  email: z.string().email()
});

export type CreateNewsletterSubscriptionInput = z.infer<typeof createNewsletterSubscriptionInputSchema>;

// Update schemas (all fields optional except ID)
export const updateProjectInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  thumbnail: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  tech_stack: z.array(z.string().min(1)).optional(),
  live_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
  featured: z.boolean().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Query input schemas
export const getProjectsInputSchema = z.object({
  featured: z.boolean().optional(),
  category: z.string().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

export type GetProjectsInput = z.infer<typeof getProjectsInputSchema>;

export const getSkillsInputSchema = z.object({
  category: z.string().optional()
});

export type GetSkillsInput = z.infer<typeof getSkillsInputSchema>;