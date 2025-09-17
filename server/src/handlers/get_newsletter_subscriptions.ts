import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type NewsletterSubscription } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getNewsletterSubscriptions = async (activeOnly: boolean = true): Promise<NewsletterSubscription[]> => {
  try {
    // Build query based on activeOnly parameter
    const results = activeOnly 
      ? await db.select()
          .from(newsletterSubscriptionsTable)
          .where(eq(newsletterSubscriptionsTable.subscribed, true))
          .orderBy(desc(newsletterSubscriptionsTable.created_at))
          .execute()
      : await db.select()
          .from(newsletterSubscriptionsTable)
          .orderBy(desc(newsletterSubscriptionsTable.created_at))
          .execute();

    // Return newsletter subscriptions (no numeric conversions needed)
    return results;
  } catch (error) {
    console.error('Newsletter subscriptions fetch failed:', error);
    throw error;
  }
};