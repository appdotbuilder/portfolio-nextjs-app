import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsletterSubscriptionsTable } from '../db/schema';
import { getNewsletterSubscriptions } from '../handlers/get_newsletter_subscriptions';
import { eq } from 'drizzle-orm';

// Test data for newsletter subscriptions
const activeSubscription1 = {
  id: 'sub1',
  email: 'active1@example.com',
  subscribed: true
};

const activeSubscription2 = {
  id: 'sub2',
  email: 'active2@example.com',
  subscribed: true
};

const inactiveSubscription = {
  id: 'sub3',
  email: 'inactive@example.com',
  subscribed: false
};

describe('getNewsletterSubscriptions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all active newsletter subscriptions by default', async () => {
    // Insert test subscriptions
    await db.insert(newsletterSubscriptionsTable)
      .values([activeSubscription1, activeSubscription2, inactiveSubscription])
      .execute();

    const result = await getNewsletterSubscriptions();

    // Should return only active subscriptions
    expect(result).toHaveLength(2);
    expect(result.every(sub => sub.subscribed === true)).toBe(true);
    
    // Check that correct emails are returned
    const emails = result.map(sub => sub.email);
    expect(emails).toContain('active1@example.com');
    expect(emails).toContain('active2@example.com');
    expect(emails).not.toContain('inactive@example.com');
  });

  it('should return all subscriptions when activeOnly is false', async () => {
    // Insert test subscriptions
    await db.insert(newsletterSubscriptionsTable)
      .values([activeSubscription1, activeSubscription2, inactiveSubscription])
      .execute();

    const result = await getNewsletterSubscriptions(false);

    // Should return all subscriptions regardless of status
    expect(result).toHaveLength(3);
    
    // Check that all emails are returned
    const emails = result.map(sub => sub.email);
    expect(emails).toContain('active1@example.com');
    expect(emails).toContain('active2@example.com');
    expect(emails).toContain('inactive@example.com');
  });

  it('should return subscriptions ordered by created_at descending', async () => {
    // Insert subscriptions with different timestamps
    const now = new Date();
    const earlier = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const earliest = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 2 days ago

    await db.insert(newsletterSubscriptionsTable)
      .values([
        { ...activeSubscription1, created_at: earliest },
        { ...activeSubscription2, created_at: now },
        { id: 'sub4', email: 'middle@example.com', subscribed: true, created_at: earlier }
      ])
      .execute();

    const result = await getNewsletterSubscriptions();

    // Should be ordered by created_at descending (newest first)
    expect(result).toHaveLength(3);
    expect(result[0].email).toBe('active2@example.com'); // Most recent
    expect(result[1].email).toBe('middle@example.com'); // Middle
    expect(result[2].email).toBe('active1@example.com'); // Oldest
  });

  it('should return empty array when no subscriptions exist', async () => {
    const result = await getNewsletterSubscriptions();
    
    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return empty array when no active subscriptions exist', async () => {
    // Insert only inactive subscriptions
    await db.insert(newsletterSubscriptionsTable)
      .values([
        { ...inactiveSubscription },
        { id: 'sub4', email: 'inactive2@example.com', subscribed: false }
      ])
      .execute();

    const result = await getNewsletterSubscriptions(true);
    
    expect(result).toHaveLength(0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle mixed subscription statuses correctly', async () => {
    // Insert mix of active and inactive subscriptions
    await db.insert(newsletterSubscriptionsTable)
      .values([
        { id: 'sub1', email: 'active1@example.com', subscribed: true },
        { id: 'sub2', email: 'inactive1@example.com', subscribed: false },
        { id: 'sub3', email: 'active2@example.com', subscribed: true },
        { id: 'sub4', email: 'inactive2@example.com', subscribed: false },
        { id: 'sub5', email: 'active3@example.com', subscribed: true }
      ])
      .execute();

    const activeResult = await getNewsletterSubscriptions(true);
    const allResult = await getNewsletterSubscriptions(false);

    // Active only should return 3 subscriptions
    expect(activeResult).toHaveLength(3);
    expect(activeResult.every(sub => sub.subscribed === true)).toBe(true);

    // All should return 5 subscriptions
    expect(allResult).toHaveLength(5);
    expect(allResult.filter(sub => sub.subscribed === true)).toHaveLength(3);
    expect(allResult.filter(sub => sub.subscribed === false)).toHaveLength(2);
  });

  it('should save subscriptions to database correctly', async () => {
    // Insert test subscription
    await db.insert(newsletterSubscriptionsTable)
      .values(activeSubscription1)
      .execute();

    const result = await getNewsletterSubscriptions();

    // Verify database contains the subscription
    const dbSubscriptions = await db.select()
      .from(newsletterSubscriptionsTable)
      .where(eq(newsletterSubscriptionsTable.id, activeSubscription1.id))
      .execute();

    expect(dbSubscriptions).toHaveLength(1);
    expect(dbSubscriptions[0].email).toBe(activeSubscription1.email);
    expect(dbSubscriptions[0].subscribed).toBe(true);
    expect(dbSubscriptions[0].created_at).toBeInstanceOf(Date);

    // Verify handler returns correct data
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(activeSubscription1.id);
    expect(result[0].email).toBe(activeSubscription1.email);
    expect(result[0].subscribed).toBe(true);
    expect(result[0].created_at).toBeInstanceOf(Date);
  });
});