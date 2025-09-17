import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { type CreateNewsletterSubscriptionInput } from '../schema';
import { createNewsletterSubscription } from '../handlers/create_newsletter_subscription';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Simple test input
const testInput: CreateNewsletterSubscriptionInput = {
  email: 'test@example.com'
};

describe('createNewsletterSubscription', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a newsletter subscription', async () => {
    const result = await createNewsletterSubscription(testInput);

    // Basic field validation
    expect(result.email).toEqual('test@example.com');
    expect(result.subscribed).toBe(true);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save subscription to database', async () => {
    const result = await createNewsletterSubscription(testInput);

    // Query database to verify record was saved
    const subscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.id, result.id))
      .execute();

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].email).toEqual('test@example.com');
    expect(subscriptions[0].subscribed).toBe(true);
    expect(subscriptions[0].created_at).toBeInstanceOf(Date);
  });

  it('should return existing subscription if email already subscribed', async () => {
    // Create first subscription
    const first = await createNewsletterSubscription(testInput);

    // Try to create duplicate subscription
    const second = await createNewsletterSubscription(testInput);

    // Should return the same subscription
    expect(second.id).toEqual(first.id);
    expect(second.email).toEqual(first.email);
    expect(second.subscribed).toBe(true);

    // Verify only one record exists in database
    const allSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.email, testInput.email))
      .execute();

    expect(allSubscriptions).toHaveLength(1);
  });

  it('should reactivate unsubscribed email', async () => {
    // Create an unsubscribed record manually
    const unsubscribedId = randomUUID();
    await db.insert(newsletterSubscriptionsTable)
      .values({
        id: unsubscribedId,
        email: testInput.email,
        subscribed: false
      })
      .execute();

    // Try to subscribe again
    const result = await createNewsletterSubscription(testInput);

    // Should reactivate the existing subscription
    expect(result.id).toEqual(unsubscribedId);
    expect(result.email).toEqual(testInput.email);
    expect(result.subscribed).toBe(true);

    // Verify database record is updated
    const updated = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.id, unsubscribedId))
      .execute();

    expect(updated[0].subscribed).toBe(true);
  });

  it('should handle different email formats correctly', async () => {
    const emails = [
      'user@domain.com',
      'test.user+tag@example.org',
      'user123@subdomain.example.net'
    ];

    const results = [];
    for (const email of emails) {
      const result = await createNewsletterSubscription({ email });
      results.push(result);
    }

    // All should be created successfully
    expect(results).toHaveLength(3);
    results.forEach((result, index) => {
      expect(result.email).toEqual(emails[index]);
      expect(result.subscribed).toBe(true);
      expect(result.id).toBeDefined();
    });

    // Verify all are saved in database
    const allSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .execute();

    expect(allSubscriptions).toHaveLength(3);
  });

  it('should handle case-sensitive email addresses', async () => {
    const lowerEmail = 'test@example.com';
    const upperEmail = 'TEST@EXAMPLE.COM';

    // Create subscription with lowercase email
    const first = await createNewsletterSubscription({ email: lowerEmail });
    
    // Try with uppercase email - should create separate subscription
    const second = await createNewsletterSubscription({ email: upperEmail });

    // Should be treated as different emails
    expect(first.id).not.toEqual(second.id);
    expect(first.email).toEqual(lowerEmail);
    expect(second.email).toEqual(upperEmail);

    // Verify both records exist
    const allSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .execute();

    expect(allSubscriptions).toHaveLength(2);
  });
});