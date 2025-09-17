import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createUserInputSchema,
  createSkillInputSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  createCertificateInputSchema,
  createExperienceInputSchema,
  createTestimonialInputSchema,
  createContactMessageInputSchema,
  createNewsletterSubscriptionInputSchema,
  getProjectsInputSchema,
  getSkillsInputSchema
} from './schema';

// Import handlers
import { getUser } from './handlers/get_user';
import { createUser } from './handlers/create_user';
import { getSkills } from './handlers/get_skills';
import { createSkill } from './handlers/create_skill';
import { getProjects } from './handlers/get_projects';
import { createProject } from './handlers/create_project';
import { updateProject } from './handlers/update_project';
import { getCertificates } from './handlers/get_certificates';
import { createCertificate } from './handlers/create_certificate';
import { getExperience } from './handlers/get_experience';
import { createExperience } from './handlers/create_experience';
import { getTestimonials } from './handlers/get_testimonials';
import { createTestimonial } from './handlers/create_testimonial';
import { createContactMessage } from './handlers/create_contact_message';
import { getContactMessages } from './handlers/get_contact_messages';
import { createNewsletterSubscription } from './handlers/create_newsletter_subscription';
import { getNewsletterSubscriptions } from './handlers/get_newsletter_subscriptions';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User routes
  getUser: publicProcedure
    .query(() => getUser()),
  
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  // Skills routes
  getSkills: publicProcedure
    .input(getSkillsInputSchema.optional())
    .query(({ input }) => getSkills(input)),
  
  createSkill: publicProcedure
    .input(createSkillInputSchema)
    .mutation(({ input }) => createSkill(input)),

  // Projects routes
  getProjects: publicProcedure
    .input(getProjectsInputSchema.optional())
    .query(({ input }) => getProjects(input)),
  
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),
  
  updateProject: publicProcedure
    .input(updateProjectInputSchema)
    .mutation(({ input }) => updateProject(input)),

  // Certificates routes
  getCertificates: publicProcedure
    .query(() => getCertificates()),
  
  createCertificate: publicProcedure
    .input(createCertificateInputSchema)
    .mutation(({ input }) => createCertificate(input)),

  // Experience routes
  getExperience: publicProcedure
    .query(() => getExperience()),
  
  createExperience: publicProcedure
    .input(createExperienceInputSchema)
    .mutation(({ input }) => createExperience(input)),

  // Testimonials routes
  getTestimonials: publicProcedure
    .query(() => getTestimonials()),
  
  createTestimonial: publicProcedure
    .input(createTestimonialInputSchema)
    .mutation(({ input }) => createTestimonial(input)),

  // Contact messages routes
  getContactMessages: publicProcedure
    .query(() => getContactMessages()),
  
  createContactMessage: publicProcedure
    .input(createContactMessageInputSchema)
    .mutation(({ input }) => createContactMessage(input)),

  // Newsletter subscription routes
  getNewsletterSubscriptions: publicProcedure
    .query(() => getNewsletterSubscriptions()),
  
  createNewsletterSubscription: publicProcedure
    .input(createNewsletterSubscriptionInputSchema)
    .mutation(({ input }) => createNewsletterSubscription(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors({
        origin: process.env['CLIENT_URL'] || 'http://localhost:3000',
        credentials: true,
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`🚀 Portfolio API server listening on port: ${port}`);
  console.log(`📝 Available routes:`);
  console.log(`   - Health: GET /healthcheck`);
  console.log(`   - User: GET /getUser, POST /createUser`);
  console.log(`   - Skills: GET /getSkills, POST /createSkill`);
  console.log(`   - Projects: GET /getProjects, POST /createProject, PUT /updateProject`);
  console.log(`   - Certificates: GET /getCertificates, POST /createCertificate`);
  console.log(`   - Experience: GET /getExperience, POST /createExperience`);
  console.log(`   - Testimonials: GET /getTestimonials, POST /createTestimonial`);
  console.log(`   - Contact: GET /getContactMessages, POST /createContactMessage`);
  console.log(`   - Newsletter: GET /getNewsletterSubscriptions, POST /createNewsletterSubscription`);
}

start();