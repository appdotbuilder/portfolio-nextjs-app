import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type CreateNewsletterSubscriptionInput, type NewsletterSubscription } from '../schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function createNewsletterSubscription(input: CreateNewsletterSubscriptionInput): Promise<NewsletterSubscription> {
  try {
    // Check if email already exists
    const existingSubscription = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.email, input.email))
      .execute();

    // If email exists and is subscribed, return the existing record
    if (existingSubscription.length > 0) {
      const existing = existingSubscription[0];
      
      // If already subscribed, return the existing subscription
      if (existing.subscribed) {
        return existing;
      }
      
      // If previously unsubscribed, reactivate the subscription
      const reactivated = await db.update(newsletterSubscriptionsTable)
        .set({ subscribed: true })
        .where(eq(newsletterSubscriptionsTable.id, existing.id))
        .returning()
        .execute();

      return reactivated[0];
    }

    // Create new subscription
    const result = await db.insert(newsletterSubscriptionsTable)
      .values({
        id: randomUUID(),
        email: input.email,
        subscribed: true
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Newsletter subscription creation failed:', error);
    throw error;
  }
}