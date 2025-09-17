import { serial, text, pgTable, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const usersTable = pgTable('users', {
  id: text('id').primaryKey(), // Using text for cuid
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  bio: text('bio'),
  avatar: text('avatar'),
  resume: text('resume'),
  social_links: jsonb('social_links'), // JSON field for social media links
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Skills table
export const skillsTable = pgTable('skills', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  level: integer('level').notNull(), // 1-100 proficiency level
  icon: text('icon'),
  experience: integer('experience'), // Years of experience
});

// Projects table
export const projectsTable = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail').notNull(),
  images: jsonb('images').notNull(), // Array of image URLs
  tech_stack: jsonb('tech_stack').notNull(), // Array of technologies
  live_url: text('live_url'),
  github_url: text('github_url'),
  featured: boolean('featured').default(false).notNull(),
  view_count: integer('view_count').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Certificates table
export const certificatesTable = pgTable('certificates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  issue_date: timestamp('issue_date').notNull(),
  credential_id: text('credential_id'),
  verify_url: text('verify_url'),
  image: text('image').notNull(),
  category: text('category'),
});

// Experience table
export const experienceTable = pgTable('experience', {
  id: text('id').primaryKey(),
  company: text('company').notNull(),
  position: text('position').notNull(),
  location: text('location'),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date'),
  description: jsonb('description').notNull(), // Array of bullet points
  current: boolean('current').default(false).notNull(),
  company_logo: text('company_logo'),
});

// Testimonials table
export const testimonialsTable = pgTable('testimonials', {
  id: text('id').primaryKey(),
  client_name: text('client_name').notNull(),
  client_photo: text('client_photo'),
  client_position: text('client_position').notNull(),
  client_company: text('client_company').notNull(),
  testimonial: text('testimonial').notNull(),
  rating: integer('rating').notNull(), // 1-5 rating
  linkedin_url: text('linkedin_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Contact messages table
export const contactMessagesTable = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  attachment: text('attachment'),
  status: text('status').default('new').notNull(), // 'new', 'read', 'replied'
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Newsletter subscriptions table
export const newsletterSubscriptionsTable = pgTable('newsletter_subscriptions', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribed: boolean('subscribed').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Skill = typeof skillsTable.$inferSelect;
export type NewSkill = typeof skillsTable.$inferInsert;

export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;

export type Certificate = typeof certificatesTable.$inferSelect;
export type NewCertificate = typeof certificatesTable.$inferInsert;

export type ExperienceRecord = typeof experienceTable.$inferSelect;
export type NewExperienceRecord = typeof experienceTable.$inferInsert;

export type Testimonial = typeof testimonialsTable.$inferSelect;
export type NewTestimonial = typeof testimonialsTable.$inferInsert;

export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type NewContactMessage = typeof contactMessagesTable.$inferInsert;

export type NewsletterSubscription = typeof newsletterSubscriptionsTable.$inferSelect;
export type NewNewsletterSubscription = typeof newsletterSubscriptionsTable.$inferInsert;

// Export all tables for proper query building and relations
export const tables = {
  users: usersTable,
  skills: skillsTable,
  projects: projectsTable,
  certificates: certificatesTable,
  experience: experienceTable,
  testimonials: testimonialsTable,
  contactMessages: contactMessagesTable,
  newsletterSubscriptions: newsletterSubscriptionsTable,
};